"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTransaction = void 0;
const mongoose_1 = require("mongoose");
const gameTransactionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
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
    requestPayload: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true, versionKey: false });
gameTransactionSchema.index({ transaction_id: 1 });
exports.GameTransaction = (0, mongoose_1.model)("GameTransaction", gameTransactionSchema);
