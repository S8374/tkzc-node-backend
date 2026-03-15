"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoExchangeModel = void 0;
const mongoose_1 = require("mongoose");
const cryptoExchangeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    icon: {
        type: String, // lucide icon name or svg url
        required: true,
    },
    gradientFrom: {
        type: String,
        required: true,
    },
    gradientTo: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.CryptoExchangeModel = (0, mongoose_1.model)("CryptoExchange", cryptoExchangeSchema);
