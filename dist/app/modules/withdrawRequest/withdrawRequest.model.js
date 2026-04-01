"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawRequest = void 0;
const mongoose_1 = require("mongoose");
const withdrawRequest_interface_1 = require("./withdrawRequest.interface");
const withdrawRequestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    paymentMethod: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: Object.values(withdrawRequest_interface_1.WithdrawStatus),
        default: withdrawRequest_interface_1.WithdrawStatus.PENDING,
    },
    adminNote: { type: String },
    adminSenderNumber: { type: String },
    adminTransactionId: { type: String },
    processedAt: { type: Date },
    processedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
withdrawRequestSchema.index({ status: 1, createdAt: -1 });
withdrawRequestSchema.index({ user: 1, status: 1, createdAt: -1 });
exports.WithdrawRequest = (0, mongoose_1.model)("WithdrawRequest", withdrawRequestSchema);
