import { IPromotionBonus } from "./promotion.interface";
import { PromotionModel } from "./promotion.modal";

// Create
const createPromotion = async (payload: IPromotionBonus) => {
  return await PromotionModel.create(payload);
};

// Get All
const getAllPromotions = async () => {
  return await PromotionModel.find().sort({ createdAt: -1 });
};

// Get By Tab (Frontend)
const getPromotionsByTab = async (tab: string) => {
  return await PromotionModel.find({
    tab,
    isActive: true,
  });
};

// Get Single
const getSinglePromotion = async (id: string) => {
  return await PromotionModel.findById(id);
};

// Update
const updatePromotion = async (
  id: string,
  payload: Partial<IPromotionBonus>
) => {
  return await PromotionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete
const deletePromotion = async (id: string) => {
  return await PromotionModel.findByIdAndDelete(id);
};

export const PromotionService = {
  createPromotion,
  getAllPromotions,
  getPromotionsByTab,
  getSinglePromotion,
  updatePromotion,
  deletePromotion,
};