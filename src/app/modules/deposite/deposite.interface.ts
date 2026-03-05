import { Types } from "mongoose";

export interface IPaymentMethod {
  _id?: Types.ObjectId;
  name: string;            
  slug: string;            
  icon: string;
  tab: string;           
  description?: string;
  text?:string;
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
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}