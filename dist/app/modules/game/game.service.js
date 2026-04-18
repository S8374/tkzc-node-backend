"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
export const GameService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { GameTransaction } from "./game.model";
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeUsername = (value) => value.trim().toLowerCase();
const findUserFromCallback = (rawUsername, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanUsername = normalizeUsername(rawUsername);
    let user = yield User.findOne({
        name: { $regex: `^${escapeRegex(cleanUsername)}$`, $options: "i" },
    });
    if (user)
        return user;
    user = yield User.findOne({
        email: { $regex: `^${escapeRegex(cleanUsername)}$`, $options: "i" },
    });
    if (user)
        return user;
    user = yield User.findOne({
        email: { $regex: `^${escapeRegex(cleanUsername)}@`, $options: "i" },
    });
    if (user)
        return user;
    if (accountId) {
        const cleanAccountId = normalizeUsername(accountId);
        user = yield User.findOne({
            name: { $regex: `^${escapeRegex(cleanAccountId)}$`, $options: "i" },
        });
        if (user)
            return user;
    }
    return null;
});
const handleCallback = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("[Game Callback] request payload:", JSON.stringify(payload, null, 2));
    const { account_id, username: rawUsername, provider_code, amount, game_code, bet_type, transaction_id, times, } = payload;
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
    const user = yield findUserFromCallback(rawUsername, account_id);
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
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const existing = yield GameTransaction.findOne({ transactionKey: txKey }).session(session);
        if (existing) {
            const existingWallet = yield Wallet.findOne({ user: user._id }).session(session);
            yield session.commitTransaction();
            console.log("[Game Callback] duplicate ignored:", txKey);
            return {
                success: true,
                message: "Duplicate callback ignored",
                data: {
                    duplicate: true,
                    transactionKey: txKey,
                    balance: (_a = existingWallet === null || existingWallet === void 0 ? void 0 : existingWallet.balance) !== null && _a !== void 0 ? _a : existing.walletBalanceAfter,
                },
            };
        }
        let wallet = yield Wallet.findOne({ user: user._id }).session(session);
        if (!wallet) {
            const created = yield Wallet.create([
                {
                    user: user._id,
                    balance: 0,
                    currentTurnover: 0,
                    requiredTurnover: 0,
                },
            ], { session });
            wallet = created[0];
        }
        let balanceChange = 0;
        let status = "lost";
        if (normalizedBetType === "BET") {
            // 🛑 Check for insufficient balance before deducting
            if (wallet.balance < amountMain) {
                yield session.abortTransaction();
                return {
                    success: false,
                    message: "Insufficient balance for BET",
                    data: { balance: wallet.balance },
                };
            }
            balanceChange = -amountMain;
            status = "lost";
            wallet.currentTurnover = Number(((wallet.currentTurnover || 0) + amountMain).toFixed(2));
        }
        else if (normalizedBetType === "SETTLE") {
            balanceChange = amountMain;
            status = amountMain > 0 ? "won" : "lost";
        }
        else if (normalizedBetType === "REFUND") {
            balanceChange = amountMain;
            status = "refunded";
        }
        else if (normalizedBetType === "CANCEL") {
            balanceChange = 0;
            status = "cancelled";
        }
        else {
            yield session.abortTransaction();
            return {
                success: false,
                message: "Invalid bet_type",
                data: null,
            };
        }
        const walletBalanceBefore = wallet.balance;
        wallet.balance = Number((wallet.balance + balanceChange).toFixed(2));
        yield wallet.save({ session });
        yield GameTransaction.create([
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
                requestPayload: payload,
            },
        ], { session });
        yield session.commitTransaction();
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
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("[Game Callback] processing error:", error);
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getUserBets = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const pageRaw = Number((_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1);
    const limitRaw = Number((_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 20);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 100) : 20;
    const skip = (page - 1) * limit;
    const filter = { user: new mongoose_1.default.Types.ObjectId(userId) };
    if (typeof (query === null || query === void 0 ? void 0 : query.provider_code) === "string" && query.provider_code.trim()) {
        filter.provider_code = query.provider_code.trim();
    }
    if (typeof (query === null || query === void 0 ? void 0 : query.status) === "string" && query.status.trim()) {
        filter.status = query.status.trim();
    }
    if (typeof (query === null || query === void 0 ? void 0 : query.bet_type) === "string" && query.bet_type.trim()) {
        filter.bet_type = query.bet_type.trim().toUpperCase();
    }
    const [rows, total, summaryRows] = yield Promise.all([
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
});
export const GameService = {
    handleCallback,
    getUserBets,
};
