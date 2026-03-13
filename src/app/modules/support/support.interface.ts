import { Types } from "mongoose";

export interface ISupport {
  _id?: Types.ObjectId;

  label: string;        // Telegram
  icon: string;         // Send | Headphones | Crown | ShieldCheck
  link: string;         // telegram link / live chat link

  buttonText: string;   
  buttonUrl: string;        
  
  order: number;        // display order
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}