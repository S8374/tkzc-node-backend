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
      balanceChange = -amountMain;
      status = "lost";
      wallet.currentTurnover = Number(((wallet.currentTurnover || 0) + amountMain).toFixed(2));
    } else if (normalizedBetType === "SETTLE") {
      balanceChange = amountMain;
      status = "won";
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

export const GameService = {
  handleCallback,
};
