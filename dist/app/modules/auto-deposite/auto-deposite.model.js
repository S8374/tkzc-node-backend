"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDeposit = void 0;
const mongoose_1 = require("mongoose");
const autoDepositSchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    selectedAmount: { type: Number, default: 0 },
    payableAmount: { type: Number, default: 0 },
    transaction_id: { type: String, required: true },
    invoice_number: { type: String, required: true },
    session_code: { type: String, required: true },
    bank: { type: String, required: true },
    footprint: { type: String, required: true },
    bonusAmount: { type: Number, default: 0 },
    bonusPercentage: { type: Number, default: 0 },
    totalWithBonus: { type: Number, default: 0 },
    turnoverMultiplier: { type: Number, default: 0 },
    turnoverRequired: { type: Number, default: 0 },
}, {
    timestamps: true,
});
// Indexes
autoDepositSchema.index({ transaction_id: 1 }, { unique: true });
autoDepositSchema.index({ invoice_number: 1 });
autoDepositSchema.index({ createdAt: -1 });
exports.AutoDeposit = (0, mongoose_1.model)("AutoDeposit", autoDepositSchema);
