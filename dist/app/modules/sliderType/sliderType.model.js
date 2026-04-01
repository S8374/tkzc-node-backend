"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderTypeModel = void 0;
const mongoose_1 = require("mongoose");
const sliderTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    iconUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    gameType: { type: String, trim: true },
    providerCode: { type: String, trim: true },
    providerName: { type: String, trim: true },
}, { timestamps: true, versionKey: false });
exports.SliderTypeModel = (0, mongoose_1.model)("SliderType", sliderTypeSchema);
