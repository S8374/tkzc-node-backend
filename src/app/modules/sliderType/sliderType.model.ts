import { Schema, model } from "mongoose";
import { ISliderType } from "./sliderType.interface";

const sliderTypeSchema = new Schema<ISliderType>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true },
        iconUrl: { type: String, trim: true }, 
        isActive: { type: Boolean, default: true, index: true },
        gameType: { type: String, trim: true },
        providerCode: { type: String, trim: true },
        providerName: { type: String, trim: true },
    },
    { timestamps: true, versionKey: false }
);

export const SliderTypeModel = model<ISliderType>("SliderType", sliderTypeSchema);
