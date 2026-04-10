import { IPromotionBonus } from "./promotion.interface";
import { PaymentMethodModel } from "../deposite/deposite.model";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { PromotionModel } from "./promotion.modal";

// Create
const createPromotion = async (payload: IPromotionBonus) => {
  // Validate maxBonus if provided
  if (payload.maxBonus && payload.maxBonus < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Maximum bonus cannot be negative");
  }

  if (payload.bonusPercentage !== undefined && payload.bonusPercentage < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bonus percentage cannot be negative");
  }

  if (payload.turnoverValue !== undefined && payload.turnoverValue < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Turnover value cannot be negative");
  }

  // Validate value
  if (payload.value <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bonus value must be greater than 0");
  }

  // Validate paymentMethodId if provided
  if (payload.paymentMethodId) {
    const paymentMethod = await PaymentMethodModel.findById(payload.paymentMethodId);
    if (!paymentMethod) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment method not found");
    }
    
    // Check if payment method belongs to the same tab
    if (paymentMethod.tab !== payload.tab) {
      throw new AppError(
        httpStatus.BAD_REQUEST, 
        `Payment method "${paymentMethod.name}" belongs to tab "${paymentMethod.tab}", not "${payload.tab}"`
      );
    }
  }

  return await PromotionModel.create(payload);
};

// Get All
const getAllPromotions = async () => {
  return await PromotionModel.find()
    .populate("paymentMethodId", "name icon tab")
    .sort({ createdAt: -1 });
};

// Get By Tab (Frontend)
const getPromotionsByTab = async (tab: string) => {
  return await PromotionModel.find({
    tab,
    isActive: true,
  })
    .populate("paymentMethodId", "name icon")
    .sort({ createdAt: -1 });
};

// Get By Payment Method
const getPromotionsByPaymentMethod = async (paymentMethodId: string) => {
  // Validate payment method exists
  const paymentMethod = await PaymentMethodModel.findById(paymentMethodId);
  if (!paymentMethod) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment method not found");
  }

  return await PromotionModel.find({
    paymentMethodId,
    isActive: true,
  }).populate("paymentMethodId", "name icon").sort({ createdAt: -1 });
};

// Get Single
const getSinglePromotion = async (id: string) => {
  const promotion = await PromotionModel.findById(id).populate(
    "paymentMethodId",
    "name icon tab"
  );
  
  if (!promotion) {
    throw new AppError(httpStatus.NOT_FOUND, "Promotion not found");
  }
  
  return promotion;
};

// Update
const updatePromotion = async (
  id: string,
  payload: Partial<IPromotionBonus>
) => {
  // Validate maxBonus if provided
  if (payload.maxBonus && payload.maxBonus < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Maximum bonus cannot be negative");
  }

  // Validate value if provided
  if (payload.value && payload.value <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bonus value must be greater than 0");
  }

  if (payload.bonusPercentage !== undefined && payload.bonusPercentage < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bonus percentage cannot be negative");
  }

  if (payload.turnoverValue !== undefined && payload.turnoverValue < 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Turnover value cannot be negative");
  }

  // Validate paymentMethodId if provided
  if (payload.paymentMethodId) {
    const paymentMethod = await PaymentMethodModel.findById(payload.paymentMethodId);
    if (!paymentMethod) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment method not found");
    }
    
    // Get current promotion to check tab
    const currentPromotion = await PromotionModel.findById(id);
    const tabToUse = payload.tab || currentPromotion?.tab;
    
    if (paymentMethod.tab !== tabToUse) {
      throw new AppError(
        httpStatus.BAD_REQUEST, 
        `Payment method "${paymentMethod.name}" belongs to tab "${paymentMethod.tab}", not "${tabToUse}"`
      );
    }
  }

  const updatedPromotion = await PromotionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("paymentMethodId", "name icon");

  if (!updatedPromotion) {
    throw new AppError(httpStatus.NOT_FOUND, "Promotion not found");
  }

  return updatedPromotion;
};

// Delete
const deletePromotion = async (id: string) => {
  const promotion = await PromotionModel.findByIdAndDelete(id);
  
  if (!promotion) {
    throw new AppError(httpStatus.NOT_FOUND, "Promotion not found");
  }
  
  return promotion;
};

export const PromotionService = {
  createPromotion,
  getAllPromotions,
  getPromotionsByTab,
  getPromotionsByPaymentMethod,
  getSinglePromotion,
  updatePromotion,
  deletePromotion,
};