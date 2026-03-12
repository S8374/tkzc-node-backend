import { Types } from "mongoose";

export interface IFormField {
  _id?: Types.ObjectId;
  label: string;                 // "Sender Account Number"
  name: string;                  // "senderNumber"
  type: "text" | "number" | "textarea"|"screenshot";
  placeholder?: string;
  required: boolean;
  order: number;
  tab: string;                    
  paymentMethodId?: Types.ObjectId;  // link to payment method
  isActive: boolean;
  isBonusField?: boolean;           
  createdAt?: Date;
  updatedAt?: Date;
}