"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModel = void 0;
const mongoose_1 = require("mongoose");
const promotionSchema = new mongoose_1.Schema({
    tab: { type: String, required: true, index: true },
    bonusName: { type: String, required: true },
    type: {
        type: String,
        enum: ["PERCENT", "FIXED"],
        required: true,
    },
    value: { type: Number, required: true },
    minDeposit: { type: Number },
    maxBonus: { type: Number }, // ✅ NEW: maximum bonus cap
    bonusPercentage: { type: Number, default: 0 },
    turnoverValue: { type: Number, default: 0 },
    paymentMethodId: {
        type: mongoose_1.Types.ObjectId,
        ref: "PaymentMethod",
        index: true
    },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
}, { timestamps: true });
exports.PromotionModel = (0, mongoose_1.model)("PromotionBonus", promotionSchema);
