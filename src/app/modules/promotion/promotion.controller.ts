import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { PromotionService } from "./promotion.service";
import { sendResponse } from "../../utils/sendResponse";

export const createPromotion = async (req: Request, res: Response) => {
  const result = await PromotionService.createPromotion(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Promotion created successfully",
    data: result,
  });
};

export const getAllPromotions = async (req: Request, res: Response) => {
  const result = await PromotionService.getAllPromotions();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

export const getPromotionsByTab = async (req: Request, res: Response) => {
  const { tab } = req.params;

  const result = await PromotionService.getPromotionsByTab(tab);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

export const updatePromotion = async (req: Request, res: Response) => {
  const result = await PromotionService.updatePromotion(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Promotion updated successfully",
    data: result,
  });
};

export const deletePromotion = async (req: Request, res: Response) => {
  await PromotionService.deletePromotion(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Promotion deleted successfully",
    data: undefined,
  });
};