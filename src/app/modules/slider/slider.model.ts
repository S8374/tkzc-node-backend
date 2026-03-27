import { Schema, model } from "mongoose";
import { ISlider } from "./slider.interface";

const sliderSchema = new Schema<ISlider>(
  {
    title: { type: String,  trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },

    // ✅ Use Schema.Types.ObjectId instead of Types.ObjectId
    sliderTypeId: { type: Schema.Types.ObjectId, ref: "SliderType", required: true },

    buttonText: { type: String, trim: true },
    imageRedirectLink: { type: String, trim: true },
    
    money: { type: Number},
    username: { type: String,  trim: true },
    provider_code: { type: String,  trim: true },
    provider_id: { type: String,  trim: true },
    game_id: { type: String,  trim: true },
    game_code: { type: String,  trim: true },
    game_type: { type: String,  trim: true },


    buttonLink: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const SliderModel = model<ISlider>("Slider", sliderSchema);
