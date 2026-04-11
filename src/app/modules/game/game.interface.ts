import { Types } from "mongoose";

export interface IGameCallbackPayload {
  account_id?: string;
  username: string;
  provider_code: string;
  amount: number | string;
  game_code: string;
  verification_key?: string;
  bet_type: "BET" | "SETTLE" | "REFUND" | "CANCEL" | string;
  transaction_id: string;
  times?: number | string;
}

export interface IGameTransaction {
  user: Types.ObjectId;
  username: string;
  provider_code: string;
  game_code: string;
  bet_type: string;
  transaction_id: string;
  transactionKey: string;
  amount: number;
  balanceChange: number;
  walletBalanceBefore: number;
  walletBalanceAfter: number;
  status: "won" | "lost" | "refunded" | "cancelled";
  requestPayload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
