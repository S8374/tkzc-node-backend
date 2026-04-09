import { Types } from "mongoose";

export enum DepositStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

export enum DepositType {
  MANUAL = "manual",
  AUTO = "auto",
  CRYPTO = "crypto"
}

export interface IDepositRequest {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  userEmail?: string;
  
  depositType: DepositType;
  paymentMethod: string; // bKash, Nagad, etc.
  amount: number;
  
  // Applied promotion (if any)
  promotionId?: Types.ObjectId;
  promotionName?: string;
  promotionType?: "PERCENT" | "FIXED";
  promotionValue?: number;
  bonusAmount?: number;
  
  // Form fields data
  formData: Record<string, any>;
  
  // Screenshot (for manual/crypto)
  screenshot?: string;
  
  // Transaction details
  transactionId?: string;
  senderNumber?: string;
  walletAddress?: string;
  
  // Turnover requirement
  turnoverMultiplier?: number;
  turnoverRequired?: number;
  
  // Status
  status: DepositStatus;
  adminNote?: string;
  
  // Timestamps
  processedAt?: Date;
  processedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}