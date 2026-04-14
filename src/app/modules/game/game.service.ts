import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { IGameCallbackPayload } from "./game.interface";
import { GameTransaction } from "./game.model";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeUsername = (value: string) => value.trim().toLowerCase();

const findUserFromCallback = async (rawUsername: string, accountId?: string) => {

  const cleanUsername = normalizeUsername(rawUsername);

  let user = await User.findOne({
    name: { $regex: `^${escapeRegex(cleanUsername)}$`, $options: "i" },
  });
  if (user) return user;

  user = await User.findOne({
    email: { $regex: `^${escapeRegex(cleanUsername)}$`, $options: "i" },
  });
  if (user) return user;

  user = await User.findOne({
    email: { $regex: `^${escapeRegex(cleanUsername)}@`, $options: "i" },
  });
  if (user) return user;

  if (accountId) {
    const cleanAccountId = normalizeUsername(accountId);
    user = await User.findOne({
      name: { $regex: `^${escapeRegex(cleanAccountId)}$`, $options: "i" },
    });
    if (user) return user;
  }

  return null;
};

const handleCallback = async (payload: IGameCallbackPayload) => {
  console.log("[Game Callback] request payload:", JSON.stringify(payload, null, 2));

  const {
    account_id,
    username: rawUsername,
    provider_code,
    amount,
    game_code,
    bet_type,
    transaction_id,
    times,
  } = payload;

  if (!rawUsername || !provider_code || amount === undefined || !game_code || !bet_type) {
    console.log("[Game Callback] missing required fields");
    return {
      success: false,
      message: "Missing required fields",
      data: null,
    };
  }

  const cleanUsername = normalizeUsername(rawUsername);
  const callbackAmount = Number(amount);

  if (!Number.isFinite(callbackAmount) || callbackAmount < 0) {
    console.log("[Game Callback] invalid amount:", amount);
    return {
      success: false,
      message: "Invalid amount",
      data: null,
    };
  }

  const amountMain = Number(callbackAmount.toFixed(2));
  const normalizedBetType = String(bet_type).toUpperCase();
  const txKey = `${transaction_id}:${normalizedBetType}:${String(times || 0)}`;

  const user = await findUserFromCallback(rawUsername, account_id);

  if (!user) {
    console.log("[Game Callback] user not found:", {
      rawUsername,
      cleanUsername,
      account_id,
    });
    return {
      success: false,
      message: "User not found",
      data: { username: cleanUsername },
    };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await GameTransaction.findOne({ transactionKey: txKey }).session(session);
    if (existing) {
      const existingWallet = await Wallet.findOne({ user: user._id }).session(session);
      await session.commitTransaction();
      console.log("[Game Callback] duplicate ignored:", txKey);
      return {
        success: true,
        message: "Duplicate callback ignored",
        data: {
          duplicate: true,
          transactionKey: txKey,
          balance: existingWallet?.balance ?? existing.walletBalanceAfter,
        },
      };
    }

    let wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet) {
      const created = await Wallet.create(
        [
          {
            user: user._id,
            balance: 0,
            currentTurnover: 0,
            requiredTurnover: 0,
          },
        ],
        { session }
      );
      wallet = created[0];
    }

    let balanceChange = 0;
    let status: "won" | "lost" | "refunded" | "cancelled" = "lost";

    if (normalizedBetType === "BET") {
      // 🛑 Check for insufficient balance before deducting
      if (wallet.balance < amountMain) {
        await session.abortTransaction();
        return {
          success: false,
          message: "Insufficient balance for BET",
          data: { balance: wallet.balance },
        };
      }
      balanceChange = -amountMain;
      status = "lost";
      wallet.currentTurnover = Number(((wallet.currentTurnover || 0) + amountMain).toFixed(2));
    } else if (normalizedBetType === "SETTLE") {
      balanceChange = amountMain;
      status = amountMain > 0 ? "won" : "lost";
    } else if (normalizedBetType === "REFUND") {
      balanceChange = amountMain;
      status = "refunded";
    } else if (normalizedBetType === "CANCEL") {
      balanceChange = 0;
      status = "cancelled";
    } else {
      await session.abortTransaction();
      return {
        success: false,
        message: "Invalid bet_type",
        data: null,
      };
    }

    const walletBalanceBefore = wallet.balance;
    wallet.balance = Number((wallet.balance + balanceChange).toFixed(2));
    await wallet.save({ session });

    await GameTransaction.create(
      [
        {
          user: user._id,
          username: cleanUsername,
          provider_code,
          game_code,
          bet_type: normalizedBetType,
          transaction_id,
          transactionKey: txKey,
          amount: amountMain,
          balanceChange,
          walletBalanceBefore,
          walletBalanceAfter: wallet.balance,
          status,
          requestPayload: payload as unknown as Record<string, unknown>,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const resultData = {
      username: cleanUsername,
      transaction_id,
      bet_type: normalizedBetType,
      amount: amountMain,
      balanceChange,
      balanceBefore: walletBalanceBefore,
      balanceAfter: wallet.balance,
      currentTurnover: wallet.currentTurnover || 0,
      requiredTurnover: wallet.requiredTurnover || 0,
    };

    console.log("[Game Callback] processed response:", JSON.stringify(resultData, null, 2));

    return {
      success: true,
      message: "Processed",
      data: resultData,
    };
  } catch (error) {
    await session.abortTransaction();
    console.error("[Game Callback] processing error:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

const getUserBets = async (userId: string, query: Record<string, unknown>) => {
  const pageRaw = Number(query?.page ?? 1);
  const limitRaw = Number(query?.limit ?? 20);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 100) : 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { user: new mongoose.Types.ObjectId(userId) };

  if (typeof query?.provider_code === "string" && query.provider_code.trim()) {
    filter.provider_code = query.provider_code.trim();
  }

  if (typeof query?.status === "string" && query.status.trim()) {
    filter.status = query.status.trim();
  }

  if (typeof query?.bet_type === "string" && query.bet_type.trim()) {
    filter.bet_type = query.bet_type.trim().toUpperCase();
  }

  const [rows, total, summaryRows] = await Promise.all([
    GameTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    GameTransaction.countDocuments(filter),
    GameTransaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalBetAmount: {
            $sum: {
              $cond: [{ $eq: ["$bet_type", "BET"] }, "$amount", 0],
            },
          },
          totalWinAmount: {
            $sum: {
              $cond: [{ $eq: ["$bet_type", "SETTLE"] }, "$amount", 0],
            },
          },
          netBalanceChange: { $sum: "$balanceChange" },
        },
      },
    ]),
  ]);

  const summary = summaryRows[0] || {
    totalRecords: 0,
    totalBetAmount: 0,
    totalWinAmount: 0,
    netBalanceChange: 0,
  };

  return {
    data: rows,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    summary,
  };
};

export const GameService = {
  handleCallback,
  getUserBets,
};
