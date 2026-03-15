"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerModel = void 0;
const mongoose_1 = require("mongoose");
const partnerSchema = new mongoose_1.Schema({
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
    logo: {
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
exports.PartnerModel = (0, mongoose_1.model)("Partner", partnerSchema);
