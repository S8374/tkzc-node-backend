import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentMethodService } from "./deposite.service";

// Create
export const createPaymentMethod = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.createPaymentMethod(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment Method Created Successfully",
    data: result,
  });
};

// Get All (Admin)
export const getAllPaymentMethods = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.getAllPaymentMethods();

  sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: ""
  });
};

// Get Active (Frontend)
export const getActivePaymentMethods = async (
  req: Request,
  res: Response
) => {
  const result = await PaymentMethodService.getActivePaymentMethods();

  sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: ""
  });
};

// Update
export const updatePaymentMethod = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.updatePaymentMethod(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Method Updated Successfully",
    data: result,
  });
};

// Delete
export const deletePaymentMethod = async (req: Request, res: Response) => {
  await PaymentMethodService.deletePaymentMethod(req.params.id);

  sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment Method Deleted Successfully",
      data: undefined
  });
};

// Create
export const createInstruction = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.createInstruction(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Instruction created successfully",
    data: result,
  });
};

// Get All
export const getAllInstructions = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.getAllInstructions();

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
};

// Get By Type
export const getInstructionsByType = async (req: Request, res: Response) => {
  const { tab } = req.params;

  const result = await PaymentMethodService.getInstructionsByType(tab);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
};
// Get By Type
export const getPaymentMethodByTab = async (req: Request, res: Response) => {
  const { tab } = req.params;

  const result = await PaymentMethodService.getPaymentMethodByTab(tab);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
};

// Update
export const updateInstruction = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.updateInstruction(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Instruction updated successfully",
    data: result,
  });
};

// Delete
export const deleteInstruction = async (req: Request, res: Response) => {
  await PaymentMethodService.deleteInstruction(req.params.id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Instruction deleted successfully",
  });
};

// Create
export const createTittle = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.createTittle(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tittle created successfully",
    data: result,
  });
};

// Get All (Admin)
export const getAllTittles = async (req: Request, res: Response) => {
  const result = await PaymentMethodService.getAllTittles();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: ""
  });
};

// Get Active by Tab (Frontend)
export const getActiveTittlesByTab = async (req: Request, res: Response) => {
  const { tab } = req.params;
  const result = await PaymentMethodService.getActiveTittlesByTab(tab);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: ""
  });
};

// Get Single
export const getSingleTittle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentMethodService.getSingleTittle(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: ""
  });
};

// Update
export const updateTittle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentMethodService.updateTittle(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tittle updated successfully",
    data: result,
  });
};

// Delete
export const deleteTittle = async (req: Request, res: Response) => {
  const { id } = req.params;
  await PaymentMethodService.deleteTittle(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tittle deleted successfully",
    data: null,
  });
};