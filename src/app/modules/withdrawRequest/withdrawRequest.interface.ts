import { Types } from "mongoose";

export enum WithdrawStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface IWithdrawRequest {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  userEmail?: string;
  paymentMethod: string;
  accountNumber: string;
  amount: number;
  status: WithdrawStatus;
  adminNote?: string;
  adminSenderNumber?: string;
  adminTransactionId?: string;
  processedAt?: Date;
  processedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
