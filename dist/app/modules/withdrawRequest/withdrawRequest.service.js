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
exports.WithdrawRequestService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const withdrawRequest_interface_1 = require("./withdrawRequest.interface");
const withdrawRequest_model_1 = require("./withdrawRequest.model");
const MIN_WITHDRAW_AMOUNT = 100;
const MAX_WITHDRAW_AMOUNT = 25000;
const parsePositiveInt = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.floor(parsed);
};
const getWithdrawEligibility = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet not found");
    }
    const requiredTurnover = wallet.requiredTurnover || 0;
    const currentTurnover = wallet.currentTurnover || 0;
    const remainingTurnover = Math.max(requiredTurnover - currentTurnover, 0);
    const hasTurnoverRequirement = requiredTurnover > 0;
    const canWithdrawByTurnover = remainingTurnover <= 0;
    return {
        hasTurnoverRequirement,
        canWithdrawByTurnover,
        currentTurnover,
        requiredTurnover,
        remainingTurnover,
        progressPercent: requiredTurnover > 0 ? Math.min((currentTurnover / requiredTurnover) * 100, 100) : 100,
        message: canWithdrawByTurnover
            ? "Turnover requirement completed. You can submit withdraw request."
            : `Withdrawal blocked. You must play at least ৳${remainingTurnover.toFixed(2)} more to complete the ৳${requiredTurnover.toFixed(2)} turnover requirement.`,
    };
});
const createWithdrawRequest = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const amount = Number(payload.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Withdraw amount must be a valid number");
        }
        if (amount < MIN_WITHDRAW_AMOUNT || amount > MAX_WITHDRAW_AMOUNT) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Withdraw amount must be between ৳${MIN_WITHDRAW_AMOUNT} and ৳${MAX_WITHDRAW_AMOUNT}`);
        }
        if (!payload.paymentMethod || !payload.accountNumber) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment method and account number are required");
        }
        const user = yield user_model_1.User.findById(userId).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet not found");
        }
        if (wallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance for withdrawal");
        }
        // Check Turnover Condition
        const turnOverRequired = wallet.requiredTurnover || 0;
        const currentTurnover = wallet.currentTurnover || 0;
        if (currentTurnover < turnOverRequired) {
            const remaining = (turnOverRequired - currentTurnover).toFixed(2);
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Withdrawal blocked. You need ৳${remaining} more turnover to meet the ৳${turnOverRequired} requirement.`);
        }
        wallet.balance -= amount;
        yield wallet.save({ session });
        const request = yield withdrawRequest_model_1.WithdrawRequest.create([
            {
                user: user._id,
                userName: user.name,
                userEmail: user.email,
                paymentMethod: payload.paymentMethod,
                accountNumber: payload.accountNumber,
                amount,
                status: withdrawRequest_interface_1.WithdrawStatus.PENDING,
            },
        ], { session });
        yield session.commitTransaction();
        return request[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getAllWithdrawRequests = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parsePositiveInt(query.page, 1);
    const limit = parsePositiveInt(query.limit, 10);
    const status = typeof query.status === "string" ? query.status : undefined;
    const paymentMethod = typeof query.paymentMethod === "string" ? query.paymentMethod : undefined;
    const search = typeof query.search === "string" ? query.search : undefined;
    const startDate = typeof query.startDate === "string" ? query.startDate : undefined;
    const endDate = typeof query.endDate === "string" ? query.endDate : undefined;
    const filter = {};
    if (status)
        filter.status = status;
    if (paymentMethod)
        filter.paymentMethod = paymentMethod;
    if (search) {
        filter.$or = [
            { userName: { $regex: search, $options: "i" } },
            { userEmail: { $regex: search, $options: "i" } },
            { accountNumber: { $regex: search, $options: "i" } },
            { adminTransactionId: { $regex: search, $options: "i" } },
        ];
    }
    if (startDate || endDate) {
        const createdAt = {};
        if (startDate)
            createdAt.$gte = new Date(startDate);
        if (endDate)
            createdAt.$lte = new Date(endDate);
        filter.createdAt = createdAt;
    }
    const skip = (page - 1) * limit;
    const requests = yield withdrawRequest_model_1.WithdrawRequest.find(filter)
        .populate("user", "name email phone")
        .populate("processedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield withdrawRequest_model_1.WithdrawRequest.countDocuments(filter);
    const stats = yield withdrawRequest_model_1.WithdrawRequest.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: requests,
        stats,
    };
});
const getUserWithdrawRequests = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parsePositiveInt(query.page, 1);
    const limit = parsePositiveInt(query.limit, 10);
    const status = typeof query.status === "string" ? query.status : undefined;
    const filter = { user: userId };
    if (status) {
        filter.status = status;
    }
    const skip = (page - 1) * limit;
    const requests = yield withdrawRequest_model_1.WithdrawRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield withdrawRequest_model_1.WithdrawRequest.countDocuments(filter);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: requests,
    };
});
const getSingleWithdrawRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield withdrawRequest_model_1.WithdrawRequest.findById(id)
        .populate("user", "name email phone")
        .populate("processedBy", "name");
    if (!request) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Withdraw request not found");
    }
    return request;
});
const processWithdrawRequest = (id, adminId, status, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const request = yield withdrawRequest_model_1.WithdrawRequest.findById(id).session(session);
        if (!request) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Withdraw request not found");
        }
        if (request.status !== withdrawRequest_interface_1.WithdrawStatus.PENDING) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Request already ${request.status.toLowerCase()}`);
        }
        if (status === withdrawRequest_interface_1.WithdrawStatus.APPROVED && !payload.adminSenderNumber) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admin sender number is required before approval");
        }
        request.status = status;
        request.adminNote = payload.adminNote;
        request.adminSenderNumber = payload.adminSenderNumber;
        request.adminTransactionId = payload.adminTransactionId;
        request.processedAt = new Date();
        request.processedBy = new mongoose_1.default.Types.ObjectId(adminId);
        yield request.save({ session });
        // If rejected, return held balance to user wallet.
        if (status === withdrawRequest_interface_1.WithdrawStatus.REJECTED) {
            const wallet = yield wallet_model_1.Wallet.findOne({ user: request.user }).session(session);
            if (!wallet) {
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
            }
            wallet.balance += request.amount;
            yield wallet.save({ session });
        }
        yield session.commitTransaction();
        return request;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const cancelWithdrawRequest = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const request = yield withdrawRequest_model_1.WithdrawRequest.findOne({ _id: id, user: userId }).session(session);
        if (!request) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Withdraw request not found");
        }
        if (request.status !== withdrawRequest_interface_1.WithdrawStatus.PENDING) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only pending requests can be cancelled");
        }
        request.status = withdrawRequest_interface_1.WithdrawStatus.CANCELLED;
        request.processedAt = new Date();
        yield request.save({ session });
        const wallet = yield wallet_model_1.Wallet.findOne({ user: request.user }).session(session);
        if (!wallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        wallet.balance += request.amount;
        yield wallet.save({ session });
        yield session.commitTransaction();
        return request;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.WithdrawRequestService = {
    getWithdrawEligibility,
    createWithdrawRequest,
    getAllWithdrawRequests,
    getUserWithdrawRequests,
    getSingleWithdrawRequest,
    processWithdrawRequest,
    cancelWithdrawRequest,
};
