"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderModel = void 0;
const mongoose_1 = require("mongoose");
const sliderSchema = new mongoose_1.Schema({
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    // ✅ Use Schema.Types.ObjectId instead of Types.ObjectId
    sliderTypeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "SliderType", required: true },
    buttonText: { type: String, trim: true },
    imageRedirectLink: { type: String, trim: true },
    detailTitle: { type: String, trim: true },
    detailSubtitle: { type: String, trim: true },
    activityTimeText: { type: String, trim: true },
    introText: { type: String, trim: true },
    rewardDetailsText: { type: String, trim: true },
    rulesText: { type: String, trim: true },
    money: { type: Number },
    username: { type: String, trim: true },
    provider_code: { type: String, trim: true },
    provider_id: { type: String, trim: true },
    game_id: { type: String, trim: true },
    game_code: { type: String, trim: true },
    game_type: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    order: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });
exports.SliderModel = (0, mongoose_1.model)("Slider", sliderSchema);
