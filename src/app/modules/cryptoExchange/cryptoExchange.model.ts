import { Schema, model } from "mongoose";
import { ICryptoExchange } from "./cryptoExchange.interface";

const cryptoExchangeSchema = new Schema<ICryptoExchange>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    icon: {
      type: String, // lucide icon name or svg url
      required: true,
    },

    gradientFrom: {
      type: String,
      required: true,
    },

    gradientTo: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CryptoExchangeModel = model<ICryptoExchange>(
  "CryptoExchange",
  cryptoExchangeSchema
);