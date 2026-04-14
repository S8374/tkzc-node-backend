import { Document } from "mongoose";

export interface IMarqueeTextTranslations {
  en?: string;
  zh?: string;
  vi?: string;
  bn?: string;
}

export interface IMarquee extends Document {
  text: string;
  textTranslations?: IMarqueeTextTranslations;
  isActive: boolean;
  order: number;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
