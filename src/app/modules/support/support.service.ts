import { ISupport } from "./support.interface";
import { SupportModel } from "./support.model";

// Create
const createSupport = async (payload: ISupport) => {
  return await SupportModel.create(payload);
};

// Get all (admin)
const getAllSupports = async () => {
  return await SupportModel.find().sort({ order: 1 });
};

// Get active (frontend)
const getActiveSupports = async () => {
  return await SupportModel.find({ isActive: true }).sort({ order: 1 });
};

// Update
const updateSupport = async (id: string, payload: Partial<ISupport>) => {
  return await SupportModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete
const deleteSupport = async (id: string) => {
  return await SupportModel.findByIdAndDelete(id);
};

export const SupportService = {
  createSupport,
  getAllSupports,
  getActiveSupports,
  updateSupport,
  deleteSupport,
};