import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { CryptoExchangeService } from "./cryptoExchange.service";

// Create
export const createExchange = async (req: Request, res: Response) => {
  const result = await CryptoExchangeService.createExchange(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Exchange created successfully",
    data: result,
  });
};

// Get all
export const getAllExchanges = async (req: Request, res: Response) => {
  const result = await CryptoExchangeService.getAllExchanges();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

// Get active
export const getActiveExchanges = async (req: Request, res: Response) => {
  const result = await CryptoExchangeService.getActiveExchanges();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

// Update
export const updateExchange = async (req: Request, res: Response) => {
  const result = await CryptoExchangeService.updateExchange(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Exchange updated successfully",
    data: result,
  });
};

// Delete
export const deleteExchange = async (req: Request, res: Response) => {
  await CryptoExchangeService.deleteExchange(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Exchange deleted successfully",
    data: null,
  });
};