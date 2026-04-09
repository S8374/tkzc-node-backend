import { Schema, model } from "mongoose";
import { IAutoDeposit } from "./auto-deposite.interface";

const autoDepositSchema = new Schema<IAutoDeposit>(
  {
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    transaction_id: { type: String, required: true },
    invoice_number: { type: String, required: true },
    session_code: { type: String, required: true },
    bank: { type: String, required: true },
    footprint: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
autoDepositSchema.index({ transaction_id: 1 }, { unique: true });
autoDepositSchema.index({ invoice_number: 1 });
autoDepositSchema.index({ createdAt: -1 });

export const AutoDeposit = model<IAutoDeposit>("AutoDeposit", autoDepositSchema);
