"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportModel = void 0;
const mongoose_1 = require("mongoose");
const supportSchema = new mongoose_1.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    icon: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    buttonUrl: {
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
exports.SupportModel = (0, mongoose_1.model)("Support", supportSchema);
