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
exports.DepositRequestService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const depositRequest_interface_1 = require("./depositRequest.interface");
const depositRequest_model_1 = require("./depositRequest.model");
const wallet_model_1 = require("../wallet/wallet.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const promotion_modal_1 = require("../promotion/promotion.modal");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const createDepositRequest = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        console.log("userId", userId);
        // Get user details
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        if (payload.depositType === depositRequest_interface_1.DepositType.CRYPTO) {
            const formData = payload.formData || {};
            const proofUrl = payload.screenshot || formData.cryptoProof || formData.__cryptoProof;
            if (!proofUrl) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Crypto deposit proof screenshot is required");
            }
            const bdtEquivalent = Number(formData.cryptoBdtEquivalent || payload.amount || 0);
            if (!Number.isFinite(bdtEquivalent) || bdtEquivalent <= 0) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid crypto converted amount");
            }
            payload.screenshot = proofUrl;
            payload.amount = bdtEquivalent;
            payload.formData = Object.assign(Object.assign({}, formData), { cryptoProof: proofUrl, cryptoBdtEquivalent: bdtEquivalent });
        }
        // Calculate bonus if promotion applied
        let bonusAmount = 0;
        if (payload.promotionId) {
            const promotion = yield promotion_modal_1.PromotionModel.findById(payload.promotionId);
            if (promotion && promotion.isActive) {
                // Check date range
                const now = new Date();
                if (promotion.startDate && promotion.startDate > now) {
                    throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Promotion not started yet");
                }
                if (promotion.endDate && promotion.endDate < now) {
                    throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Promotion has expired");
                }
                // Check minimum deposit
                if (promotion.minDeposit && payload.amount < promotion.minDeposit) {
                    throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Minimum deposit for this promotion is ৳${promotion.minDeposit}`);
                }
                // Calculate bonus
                if (promotion.type === "PERCENT") {
                    bonusAmount = (payload.amount * promotion.value) / 100;
                }
                else {
                    bonusAmount = promotion.value;
                }
                // No maxBonus field in promotion
            }
        }
        // Create deposit request
        const depositRequest = yield depositRequest_model_1.DepositRequest.create([Object.assign(Object.assign({ user: userId, userName: user.name, userEmail: user.email }, payload), { turnoverMultiplier: payload.turnoverMultiplier, turnoverRequired: payload.turnoverRequired, bonusAmount, status: depositRequest_interface_1.DepositStatus.PENDING })], { session });
        yield session.commitTransaction();
        return depositRequest[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getAllDepositRequests = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status, depositType, search, startDate, endDate } = query;
    const filter = {};
    if (status)
        filter.status = status;
    if (depositType)
        filter.depositType = depositType;
    if (search) {
        filter.$or = [
            { userName: { $regex: search, $options: "i" } },
            { userEmail: { $regex: search, $options: "i" } },
            { transactionId: { $regex: search, $options: "i" } }
        ];
    }
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate)
            filter.createdAt.$gte = new Date(startDate);
        if (endDate)
            filter.createdAt.$lte = new Date(endDate);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const requests = yield depositRequest_model_1.DepositRequest.find(filter)
        .populate("user", "name email phone")
        .populate("processedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    const total = yield depositRequest_model_1.DepositRequest.countDocuments(filter);
    // Get statistics
    const stats = yield depositRequest_model_1.DepositRequest.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
                totalBonus: { $sum: "$bonusAmount" }
            }
        }
    ]);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: requests,
        stats
    };
});
const getUserDepositRequests = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status } = query;
    const filter = { user: userId };
    if (status)
        filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const requests = yield depositRequest_model_1.DepositRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    const total = yield depositRequest_model_1.DepositRequest.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: requests,
    };
});
const getSingleDepositRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield depositRequest_model_1.DepositRequest.findById(id)
        .populate("user", "name email phone")
        .populate("processedBy", "name");
    if (!request) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Deposit request not found");
    }
    return request;
});
const processDepositRequest = (id, adminId, status, adminNote, bonusAmount, turnoverRequired) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const request = yield depositRequest_model_1.DepositRequest.findById(id).session(session);
        if (!request) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Deposit request not found");
        }
        if (request.status !== depositRequest_interface_1.DepositStatus.PENDING) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Request already ${request.status.toLowerCase()}`);
        }
        // Update request fields if provided by admin
        if (bonusAmount !== undefined) {
            request.bonusAmount = bonusAmount;
        }
        if (turnoverRequired !== undefined) {
            request.turnoverRequired = turnoverRequired;
        }
        // Update request status
        request.status = status;
        request.adminNote = adminNote;
        request.processedAt = new Date();
        request.processedBy = new mongoose_1.default.Types.ObjectId(adminId);
        yield request.save({ session });
        // If approved, add to wallet
        if (status === depositRequest_interface_1.DepositStatus.APPROVED) {
            const totalAmount = request.amount + (request.bonusAmount || 0);
            const wallet = yield wallet_model_1.Wallet.findOne({ user: request.user }).session(session);
            if (wallet) {
                wallet.balance += totalAmount;
                // Also increase required turnover if applicable
                if (request.turnoverRequired && request.turnoverRequired > 0) {
                    wallet.requiredTurnover = (wallet.requiredTurnover || 0) + request.turnoverRequired;
                }
                yield wallet.save({ session });
            }
            else {
                // Create wallet if doesn't exist
                yield wallet_model_1.Wallet.create([{
                        user: request.user,
                        balance: totalAmount,
                        requiredTurnover: request.turnoverRequired || 0
                    }], { session });
            }
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
const deleteDepositRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield depositRequest_model_1.DepositRequest.findByIdAndDelete(id);
    if (!request) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Deposit request not found");
    }
    return request;
});
exports.DepositRequestService = {
    createDepositRequest,
    getAllDepositRequests,
    getUserDepositRequests,
    getSingleDepositRequest,
    processDepositRequest,
    deleteDepositRequest,
};
