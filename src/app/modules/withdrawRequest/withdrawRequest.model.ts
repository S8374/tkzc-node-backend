import { Schema, model } from "mongoose";
import { IWithdrawRequest, WithdrawStatus } from "./withdrawRequest.interface";

const withdrawRequestSchema = new Schema<IWithdrawRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    paymentMethod: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(WithdrawStatus),
      default: WithdrawStatus.PENDING,
    },
    adminNote: { type: String },
    adminSenderNumber: { type: String },
    adminTransactionId: { type: String },
    processedAt: { type: Date },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

withdrawRequestSchema.index({ status: 1, createdAt: -1 });
withdrawRequestSchema.index({ user: 1, status: 1, createdAt: -1 });

export const WithdrawRequest = model<IWithdrawRequest>("WithdrawRequest", withdrawRequestSchema);
