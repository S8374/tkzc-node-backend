import { Schema, model } from "mongoose";
import { ISupport } from "./support.interface";

const supportSchema = new Schema<ISupport>(
  {
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
    buttonText:{
        type: String,
        required: true,
    },
    buttonUrl:{
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const SupportModel = model<ISupport>("Support", supportSchema);