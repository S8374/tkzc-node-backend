"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderTypeModel = void 0;
const mongoose_1 = require("mongoose");
const sliderTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    iconUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true, versionKey: false });
exports.SliderTypeModel = (0, mongoose_1.model)("SliderType", sliderTypeSchema);
