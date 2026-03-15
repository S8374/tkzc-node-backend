"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TittleModel = exports.InstructionModel = exports.PaymentMethodModel = void 0;
const mongoose_1 = require("mongoose");
const paymentMethodSchema = new mongoose_1.Schema({
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
        type: String,
        required: true,
    },
    tab: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.PaymentMethodModel = (0, mongoose_1.model)("PaymentMethod", paymentMethodSchema);
const instructionSchema = new mongoose_1.Schema({
    step: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    tab: {
        type: String,
        required: true,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.InstructionModel = (0, mongoose_1.model)("Instruction", instructionSchema);
const tittleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    tab: {
        type: String,
        required: true,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.TittleModel = (0, mongoose_1.model)("Tittle", tittleSchema);
