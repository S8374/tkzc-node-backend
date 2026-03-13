import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { SupportService } from "./support.service";

// Create
export const createSupport = async (req: Request, res: Response) => {
  const result = await SupportService.createSupport(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Support created successfully",
    data: result,
  });
};

// Admin list
export const getAllSupports = async (req: Request, res: Response) => {
  const result = await SupportService.getAllSupports();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

// Frontend list
export const getActiveSupports = async (req: Request, res: Response) => {
  const result = await SupportService.getActiveSupports();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

// Update
export const updateSupport = async (req: Request, res: Response) => {
  const result = await SupportService.updateSupport(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Support updated successfully",
    data: result,
  });
};

// Delete
export const deleteSupport = async (req: Request, res: Response) => {
  await SupportService.deleteSupport(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Support deleted successfully",
    data: null,
  });
};