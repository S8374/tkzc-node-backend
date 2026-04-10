import { Types } from "mongoose";

export type DownloadCategory = "VPN" | "WALLET";

export interface IDownloadApp {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  icon: string;
  category: DownloadCategory;
  downloadUrl: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
