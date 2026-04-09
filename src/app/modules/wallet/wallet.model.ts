import { Schema, model } from "mongoose";
import { IWallet, WalletProtocol } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wallet per user
    },

    walletPassword: {
      type: String,
    },

    balance: {
      type: Number,
      default: 0,
    },

    walletAddress: {
      type: String,
    },

    protocol: {
      type: String,
      enum: Object.values(WalletProtocol),
    },
    
    currentTurnover: {
      type: Number,
      default: 0,
    },
    
    requiredTurnover: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
