import { Types } from "mongoose";

export interface IPartner {
  _id?: Types.ObjectId;

  name: string;          // Evolution Gaming
  slug: string;          // evolution
  logo: string;          // image URL

  order: number;         // display order
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}