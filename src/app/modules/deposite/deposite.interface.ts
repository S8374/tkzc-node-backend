import { Types } from "mongoose";

export interface ITittle {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  isActive: boolean;
  tab: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaymentMethod {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  icon: string;
  tab: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInstruction {
  _id?: Types.ObjectId;
  step: number;
  text: string;
  tab: string;
  paymentMethodId?: Types.ObjectId; // ✅ NEW: link to specific payment method
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}