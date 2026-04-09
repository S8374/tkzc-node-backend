import { Types } from "mongoose";

export interface IAutoDeposit {
  status: string;
  amount: number;
  transaction_id: string;
  invoice_number: string;
  session_code: string;
  bank: string;
  footprint: string;
  createdAt?: Date;
  updatedAt?: Date;
}
