"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marquee = void 0;
const mongoose_1 = require("mongoose");
const marqueeSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
}, {
    timestamps: true,
});
exports.Marquee = (0, mongoose_1.model)("Marquee", marqueeSchema);
