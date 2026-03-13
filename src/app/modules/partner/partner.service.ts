import { IPartner } from "./partner.interface";
import { PartnerModel } from "./partner.model";

// Create
const createPartner = async (payload: IPartner) => {
  return await PartnerModel.create(payload);
};

// Get All (Admin)
const getAllPartners = async () => {
  return await PartnerModel.find().sort({ order: 1 });
};

// Get Active (Frontend)
const getActivePartners = async () => {
  return await PartnerModel.find({ isActive: true }).sort({ order: 1 });
};

// Update
const updatePartner = async (id: string, payload: Partial<IPartner>) => {
  return await PartnerModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete
const deletePartner = async (id: string) => {
  return await PartnerModel.findByIdAndDelete(id);
};

export const PartnerService = {
  createPartner,
  getAllPartners,
  getActivePartners,
  updatePartner,
  deletePartner,
};