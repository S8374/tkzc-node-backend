import { Schema, model } from "mongoose";
import { IDepositRequest, DepositStatus, DepositType } from "./depositRequest.interface";

const depositRequestSchema = new Schema<IDepositRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    
    depositType: { type: String, enum: Object.values(DepositType), required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    
    promotionId: { type: Schema.Types.ObjectId, ref: "PromotionBonus" },
    promotionName: { type: String },
    promotionType: { type: String, enum: ["PERCENT", "FIXED"] },
    promotionValue: { type: Number },
    bonusAmount: { type: Number, default: 0 },
    
    formData: { type: Schema.Types.Mixed, default: {} },
    
    screenshot: { type: String },
    
    transactionId: { type: String },
    senderNumber: { type: String },
    walletAddress: { type: String },
    
    status: { 
      type: String, 
      enum: Object.values(DepositStatus), 
      default: DepositStatus.PENDING 
    },
    adminNote: { type: String },
    
    processedAt: { type: Date },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for better query performance
depositRequestSchema.index({ status: 1, createdAt: -1 });
depositRequestSchema.index({ user: 1, status: 1 });
depositRequestSchema.index({ createdAt: -1 });

export const DepositRequest = model<IDepositRequest>("DepositRequest", depositRequestSchema);