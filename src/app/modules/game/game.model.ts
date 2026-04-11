import { Schema, model } from "mongoose";
import { IGameTransaction } from "./game.interface";

const gameTransactionSchema = new Schema<IGameTransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    username: { type: String, required: true, index: true },
    provider_code: { type: String, required: true },
    game_code: { type: String, required: true },
    bet_type: { type: String, required: true },
    transaction_id: { type: String, required: true },
    transactionKey: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    balanceChange: { type: Number, required: true },
    walletBalanceBefore: { type: Number, required: true },
    walletBalanceAfter: { type: Number, required: true },
    status: {
      type: String,
      enum: ["won", "lost", "refunded", "cancelled"],
      required: true,
    },
    requestPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false }
);

gameTransactionSchema.index({ transaction_id: 1 });

export const GameTransaction = model<IGameTransaction>("GameTransaction", gameTransactionSchema);
