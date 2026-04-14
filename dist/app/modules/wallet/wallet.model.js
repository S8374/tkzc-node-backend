"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const walletSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // one wallet per user
    },
    walletPassword: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
    },
    walletAddress: {
        type: String,
    },
    protocol: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletProtocol),
    },
    currentTurnover: {
        type: Number,
        default: 0,
    },
    requiredTurnover: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, versionKey: false });
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
