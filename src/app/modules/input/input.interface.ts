import { Types } from "mongoose";

export interface IFormField {
  _id?: Types.ObjectId;        
  label: string;                 // "Agent Number"
  name: string;                  // "agentNumber"
  type: "text" | "number" | "textarea" | "screenshot" | "static";
  placeholder?: string;
  required: boolean;
  order: number;
  tab: string;                    
  paymentMethodId?: Types.ObjectId;
  isActive: boolean;
  isBonusField?: boolean;
  staticValue?: string;          // ✅ New field for static/pre-filled values
  isCopyable?: boolean;           // ✅ New field to enable copy functionality
  createdAt?: Date;
  updatedAt?: Date;
}