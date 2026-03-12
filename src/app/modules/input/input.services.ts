import AppError from "../../errorHelpers/AppError";
import { IFormField } from "./input.interface";
import { FormFieldModel } from "./input.model";
import httpStatus from "http-status-codes";

// Create
// Create
const createField = async (payload: IFormField) => {

  // ✅ Bonus field validation
  if (payload.isBonusField) {
    const existingBonus = await FormFieldModel.findOne({
      tab: payload.tab,
      isBonusField: true,
    });

    if (existingBonus) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Bonus field already exists for tab "${payload.tab}"`
      );
    }
  }

  return await FormFieldModel.create(payload);
};

// Get by payment method
const getFieldsByPaymentMethod = async (paymentMethodId: string) => {
  return await FormFieldModel.find({
    paymentMethodId,
    isActive: true,
  }).sort({ order: 1 });
};
const getInputByTab = async (tab: string) => {
  return await FormFieldModel.find({ tab }).sort({ order: 1 });
};
// Update
const updateField = async (id: string, payload: Partial<IFormField>) => {

  if (payload.isBonusField) {
    const field = await FormFieldModel.findById(id);

    const existingBonus = await FormFieldModel.findOne({
      tab: field?.tab,
      isBonusField: true,
      _id: { $ne: id }, // ignore current field
    });

    if (existingBonus) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Bonus field already exists for tab "${field?.tab}"`
      );
    }
  }

  return await FormFieldModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};
// Delete
const deleteField = async (id: string) => {
  return await FormFieldModel.findByIdAndDelete(id);
};

export const FormFieldService = {
  createField,
  getFieldsByPaymentMethod,
  updateField,
  deleteField,
  getInputByTab
};