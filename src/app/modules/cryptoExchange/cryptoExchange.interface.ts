import { Types } from "mongoose";

export interface ICryptoExchange {
  _id?: Types.ObjectId;

  name: string;        // Binance
  slug: string;        // binance
  icon: string;        // icon name or svg url

  gradientFrom: string; // tailwind color
  gradientTo: string;
  
  order: number;
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}