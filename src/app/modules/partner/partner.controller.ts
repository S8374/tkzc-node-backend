import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { PartnerService } from "./partner.service";

// Create
export const createPartner = async (req: Request, res: Response) => {
  const result = await PartnerService.createPartner(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Partner created successfully",
    data: result,
  });
};

// Admin Get All
export const getAllPartners = async (req: Request, res: Response) => {
  const result = await PartnerService.getAllPartners();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

// Frontend Get Active
export const getActivePartners = async (req: Request, res: Response) => {
  const result = await PartnerService.getActivePartners();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

// Update
export const updatePartner = async (req: Request, res: Response) => {
  const result = await PartnerService.updatePartner(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Partner updated successfully",
    data: result,
  });
};

// Delete
export const deletePartner = async (req: Request, res: Response) => {
  await PartnerService.deletePartner(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Partner deleted successfully",
    data: undefined,
  });
};