import { Types } from "mongoose";

export interface IPromotionBonus {
  _id?: Types.ObjectId;

  tab: string;                 // manual / auto / crypto
  bonusName: string;           // Eid Bonus / Welcome Bonus

  type: "PERCENT" | "FIXED";   // percent or fixed amount

  value: number;               // 10 (%) OR 50 BDT

  minDeposit?: number;         // minimum deposit to apply
  maxBonus?: number;           // ✅ NEW: maximum bonus amount (cap)
  bonusPercentage?: number;
  turnoverValue?: number;

  paymentMethodId?: Types.ObjectId; // ✅ NEW: link to specific payment method

  isActive: boolean;

  startDate?: Date;
  endDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}