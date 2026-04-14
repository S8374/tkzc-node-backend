"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadAppModel = void 0;
const mongoose_1 = require("mongoose");
const downloadAppSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, required: true },
    category: { type: String, enum: ["VPN", "WALLET"], required: true },
    downloadUrl: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
downloadAppSchema.index({ category: 1, order: 1, isActive: 1 });
exports.DownloadAppModel = (0, mongoose_1.model)("DownloadApp", downloadAppSchema);
