import AppError from "../../errorHelpers/AppError";
import { IInstruction, IPaymentMethod, ITittle } from "./deposite.interface";
import { InstructionModel, PaymentMethodModel, TittleModel } from "./deposite.model";
import httpStatus from "http-status-codes";

// Create
const createPaymentMethod = async (payload: IPaymentMethod) => {
  return await PaymentMethodModel.create(payload);
};

// Get All (Admin)
const getAllPaymentMethods = async () => {
  return await PaymentMethodModel.find().sort({ order: 1 });
};

// Get Active (Frontend)
const getActivePaymentMethods = async () => {
  return await PaymentMethodModel.find({ isActive: true }).sort({ order: 1 });
};
const getPaymentMethodByTab = async (tab: string) => {
  return await PaymentMethodModel.find({ tab, isActive: true }).sort({ order: 1 });
};
// Get Single
const getSinglePaymentMethod = async (id: string) => {
  return await PaymentMethodModel.findById(id);
};

// Update
const updatePaymentMethod = async (
  id: string,
  payload: Partial<IPaymentMethod>
) => {
  return await PaymentMethodModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete
const deletePaymentMethod = async (id: string) => {
  return await PaymentMethodModel.findByIdAndDelete(id);
};
// Create
const createInstruction = async (payload: IInstruction) => {
  return await InstructionModel.create(payload);
};

// Get All
const getAllInstructions = async () => {
  return await InstructionModel.find().sort({ step: 1 });
};

// Get By Type (important for frontend filtering)
const getInstructionsByType = async (tab: string) => {
  return await InstructionModel.find({ tab, isActive: true }).sort({ step: 1 });
};

// Get Single
const getSingleInstruction = async (id: string) => {
  return await InstructionModel.findById(id);
};

// Update
const updateInstruction = async (
  id: string,
  payload: Partial<IInstruction>
) => {
  return await InstructionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete
const deleteInstruction = async (id: string) => {
  return await InstructionModel.findByIdAndDelete(id);
};


// Create with unique tab check
const createTittle = async (payload: ITittle) => {
  // Check if a Tittle already exists for this tab
  const existing = await TittleModel.findOne({ tab: payload.tab });
  if (existing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `A Tittle already exists for tab "${payload.tab}". Only one allowed per tab.`
    );
  }

  return await TittleModel.create(payload);
};


// Get All
const getAllTittles = async () => {
  return await TittleModel.find().sort({ createdAt: -1 });
};

// Get Active by Tab
const getActiveTittlesByTab = async (tab: string) => {
  return await TittleModel.find({ tab, isActive: true }).sort({ createdAt: -1 });
};

// Get Single
const getSingleTittle = async (id: string) => {
  return await TittleModel.findById(id);
};

// Update (optional: also prevent changing tab to duplicate)
const updateTittle = async (id: string, payload: Partial<ITittle>) => {
  if (payload.tab) {
    const existing = await TittleModel.findOne({ tab: payload.tab, _id: { $ne: id } });
    if (existing) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Another Tittle already exists for tab "${payload.tab}". Only one allowed per tab.`
      );
    }
  }

  return await TittleModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};
// Delete
const deleteTittle = async (id: string) => {
  return await TittleModel.findByIdAndDelete(id);
};


export const PaymentMethodService = {
  createPaymentMethod,
  getAllPaymentMethods,
  getActivePaymentMethods,
  getSinglePaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
    createInstruction,
  getAllInstructions,
  getInstructionsByType,
  getSingleInstruction,
  updateInstruction,
  deleteInstruction,
  getPaymentMethodByTab,

  createTittle,
  getAllTittles,
  getActiveTittlesByTab,
  getSingleTittle,
  updateTittle,
  deleteTittle,
};