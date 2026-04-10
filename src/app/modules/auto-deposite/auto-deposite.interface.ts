import { Types } from "mongoose";

export interface IAutoDeposit {
  status: string;
  amount: number;
  selectedAmount?: number;
  payableAmount?: number;
  transaction_id: string;
  invoice_number: string;
  session_code: string;
  bank: string;
  footprint: string;
  bonusAmount?: number;
  bonusPercentage?: number;
  totalWithBonus?: number;
  turnoverMultiplier?: number;
  turnoverRequired?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
