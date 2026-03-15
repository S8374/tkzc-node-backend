"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositRequest = void 0;
const mongoose_1 = require("mongoose");
const depositRequest_interface_1 = require("./depositRequest.interface");
const depositRequestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    depositType: { type: String, enum: Object.values(depositRequest_interface_1.DepositType), required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    promotionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "PromotionBonus" },
    promotionName: { type: String },
    promotionType: { type: String, enum: ["PERCENT", "FIXED"] },
    promotionValue: { type: Number },
    bonusAmount: { type: Number, default: 0 },
    formData: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    screenshot: { type: String },
    transactionId: { type: String },
    senderNumber: { type: String },
    walletAddress: { type: String },
    status: {
        type: String,
        enum: Object.values(depositRequest_interface_1.DepositStatus),
        default: depositRequest_interface_1.DepositStatus.PENDING
    },
    adminNote: { type: String },
    processedAt: { type: Date },
    processedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
// Indexes for better query performance
depositRequestSchema.index({ status: 1, createdAt: -1 });
depositRequestSchema.index({ user: 1, status: 1 });
depositRequestSchema.index({ createdAt: -1 });
exports.DepositRequest = (0, mongoose_1.model)("DepositRequest", depositRequestSchema);
