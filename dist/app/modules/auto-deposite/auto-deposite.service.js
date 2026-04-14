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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDepositServices = void 0;
const auto_deposite_model_1 = require("./auto-deposite.model");
const depositRequest_model_1 = require("../depositRequest/depositRequest.model");
const depositRequest_interface_1 = require("../depositRequest/depositRequest.interface");
const user_model_1 = require("../user/user.model");
const deposite_model_1 = require("../deposite/deposite.model");
const wallet_model_1 = require("../wallet/wallet.model");
const isSuccessfulAutoDeposit = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    return normalized === "success" || normalized === "successful" || normalized === "paid" || normalized === "completed";
};
const handleCallback = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Save or update. If transaction_id already exists, skip or update.
    const existing = yield auto_deposite_model_1.AutoDeposit.findOne({ transaction_id: payload.transaction_id });
    if (existing) {
        return existing;
    }
    const autoDeposit = yield auto_deposite_model_1.AutoDeposit.create(payload);
    // Extract metadata from invoice_number:
    // New: AUTO_userId_methodId_baseAmountCents_bonusCents_totalWithBonusCents_turnoverRequiredCents_turnoverMultiplier_bonusPercentage_timestamp
    // Old: AUTO_userId_methodId_bonusCents_totalWithBonusCents_turnoverRequiredCents_turnoverMultiplier_bonusPercentage_timestamp
    const invoiceParts = payload.invoice_number.split("_");
    if (invoiceParts[0] === "AUTO" && invoiceParts.length >= 4) {
        const userId = invoiceParts[1];
        const methodId = invoiceParts[2];
        const hasNewMetadata = invoiceParts.length >= 10;
        const hasOldMetadata = invoiceParts.length >= 9;
        const metadataSelectedAmount = hasNewMetadata ? Number(invoiceParts[3] || 0) / 100 : undefined;
        const metadataBonusAmount = hasNewMetadata
            ? Number(invoiceParts[4] || 0) / 100
            : hasOldMetadata
                ? Number(invoiceParts[3] || 0) / 100
                : undefined;
        const metadataTotalWithBonus = hasNewMetadata
            ? Number(invoiceParts[5] || 0) / 100
            : hasOldMetadata
                ? Number(invoiceParts[4] || 0) / 100
                : undefined;
        const metadataTurnoverRequired = hasNewMetadata
            ? Number(invoiceParts[6] || 0) / 100
            : hasOldMetadata
                ? Number(invoiceParts[5] || 0) / 100
                : undefined;
        const metadataTurnoverMultiplier = hasNewMetadata
            ? Number(invoiceParts[7] || 0)
            : hasOldMetadata
                ? Number(invoiceParts[6] || 0)
                : undefined;
        const metadataBonusPercentage = hasNewMetadata
            ? Number(invoiceParts[8] || 0)
            : hasOldMetadata
                ? Number(invoiceParts[7] || 0)
                : undefined;
        try {
            const [user, paymentMethod] = yield Promise.all([
                user_model_1.User.findById(userId),
                deposite_model_1.PaymentMethodModel.findById(methodId)
            ]);
            if (user) {
                const selectedAmount = Number((metadataSelectedAmount !== null && metadataSelectedAmount !== void 0 ? metadataSelectedAmount : payload.amount).toFixed(2));
                const payableAmount = Number((payload.amount || metadataTotalWithBonus || selectedAmount).toFixed(2));
                const bonusAmount = Number((metadataBonusAmount !== null && metadataBonusAmount !== void 0 ? metadataBonusAmount : 0).toFixed(2));
                const totalWithBonus = Number(((metadataTotalWithBonus !== null && metadataTotalWithBonus !== void 0 ? metadataTotalWithBonus : (selectedAmount + bonusAmount))).toFixed(2));
                const bonusPercentage = Number((metadataBonusPercentage !== null && metadataBonusPercentage !== void 0 ? metadataBonusPercentage : (selectedAmount > 0
                    ? (bonusAmount / selectedAmount) * 100
                    : 0)).toFixed(2));
                const tournOverMultiplier = Number((metadataTurnoverMultiplier !== null && metadataTurnoverMultiplier !== void 0 ? metadataTurnoverMultiplier : 0).toFixed(2));
                const turnoverRequired = Number((metadataTurnoverRequired !== null && metadataTurnoverRequired !== void 0 ? metadataTurnoverRequired : (tournOverMultiplier > 0
                    ? totalWithBonus * tournOverMultiplier
                    : 0)).toFixed(2));
                const requestStatus = isSuccessfulAutoDeposit(payload.status)
                    ? depositRequest_interface_1.DepositStatus.APPROVED
                    : depositRequest_interface_1.DepositStatus.PENDING;
                // Create a DepositRequest so it shows up in the admin dashboard
                yield depositRequest_model_1.DepositRequest.create({
                    user: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    depositType: depositRequest_interface_1.DepositType.AUTO,
                    paymentMethod: (paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.name) || payload.bank || "OraclePay",
                    amount: selectedAmount,
                    bonusAmount: bonusAmount,
                    turnoverMultiplier: tournOverMultiplier,
                    turnoverRequired: turnoverRequired,
                    transactionId: payload.transaction_id,
                    status: requestStatus,
                    processedAt: requestStatus === depositRequest_interface_1.DepositStatus.APPROVED ? new Date() : undefined,
                    formData: {
                        invoice_number: payload.invoice_number,
                        session_code: payload.session_code,
                        bank: payload.bank,
                        paymentMethodId: methodId,
                        selectedAmount,
                        payableAmount,
                        bonusPercentage,
                        totalWithBonus,
                        turnoverMultiplier: tournOverMultiplier,
                        turnoverRequired,
                    }
                });
                // If callback is successful, immediately apply deposit and turnover lock to wallet.
                if (requestStatus === depositRequest_interface_1.DepositStatus.APPROVED) {
                    const wallet = yield wallet_model_1.Wallet.findOne({ user: user._id });
                    if (wallet) {
                        wallet.balance = Number(((wallet.balance || 0) + totalWithBonus).toFixed(2));
                        if (turnoverRequired > 0) {
                            wallet.requiredTurnover = Number(((wallet.requiredTurnover || 0) + turnoverRequired).toFixed(2));
                        }
                        yield wallet.save();
                    }
                    else {
                        yield wallet_model_1.Wallet.create({
                            user: user._id,
                            balance: totalWithBonus,
                            requiredTurnover: turnoverRequired > 0 ? turnoverRequired : 0,
                            currentTurnover: 0,
                        });
                    }
                }
                // Also update the AutoDeposit log with these values
                yield auto_deposite_model_1.AutoDeposit.findByIdAndUpdate(autoDeposit._id, {
                    selectedAmount,
                    payableAmount,
                    bonusAmount,
                    bonusPercentage,
                    totalWithBonus,
                    turnoverMultiplier: tournOverMultiplier,
                    turnoverRequired
                });
            }
        }
        catch (error) {
            console.error("Failed to create DepositRequest from auto-deposit callback:", error);
        }
    }
    return autoDeposit;
});
const getAllAutoDeposits = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, search } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (search) {
        filter.$or = [
            { transaction_id: { $regex: search, $options: "i" } },
            { invoice_number: { $regex: search, $options: "i" } },
            { bank: { $regex: search, $options: "i" } },
        ];
    }
    const result = yield auto_deposite_model_1.AutoDeposit.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    const total = yield auto_deposite_model_1.AutoDeposit.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
});
exports.AutoDepositServices = {
    handleCallback,
    getAllAutoDeposits,
};
