import { ICryptoExchange } from "./cryptoExchange.interface";
import { CryptoExchangeModel } from "./cryptoExchange.model";

// Create
const createExchange = async (payload: ICryptoExchange) => {
  return await CryptoExchangeModel.create(payload);
};

// Get All (admin)
const getAllExchanges = async () => {
  return await CryptoExchangeModel.find().sort({ order: 1 });
};

// Get Active (frontend)
const getActiveExchanges = async () => {
  return await CryptoExchangeModel.find({ isActive: true }).sort({ order: 1 });
};

// Update
const updateExchange = async (
  id: string,
  payload: Partial<ICryptoExchange>
) => {
  return await CryptoExchangeModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete
const deleteExchange = async (id: string) => {
  return await CryptoExchangeModel.findByIdAndDelete(id);
};

export const CryptoExchangeService = {
  createExchange,
  getAllExchanges,
  getActiveExchanges,
  updateExchange,
  deleteExchange,
};