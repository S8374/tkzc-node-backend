import { Schema, model } from "mongoose";
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