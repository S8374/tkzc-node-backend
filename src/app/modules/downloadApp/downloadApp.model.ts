import { Schema, model } from "mongoose";
import { IDownloadApp } from "./downloadApp.interface";

const downloadAppSchema = new Schema<IDownloadApp>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, required: true },
    category: { type: String, enum: ["VPN", "WALLET"], required: true },
    downloadUrl: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

downloadAppSchema.index({ category: 1, order: 1, isActive: 1 });

export const DownloadAppModel = model<IDownloadApp>("DownloadApp", downloadAppSchema);
