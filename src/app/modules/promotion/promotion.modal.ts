import { Schema, model, Types } from "mongoose";
import { IPromotionBonus } from "./promotion.interface";

const promotionSchema = new Schema<IPromotionBonus>(
  {
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

    paymentMethodId: {           // ✅ NEW: link to payment method
      type: Types.ObjectId,
      ref: "PaymentMethod",
      index: true
    },

    isActive: { type: Boolean, default: true },

    startDate: { type: Date },

    endDate: { type: Date },
  },
  { timestamps: true }
);

export const PromotionModel = model<IPromotionBonus>(
  "PromotionBonus",
  promotionSchema
);