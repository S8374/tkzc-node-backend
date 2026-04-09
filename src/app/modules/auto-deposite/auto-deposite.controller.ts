import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AutoDepositServices } from "./auto-deposite.service";

const handleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AutoDepositServices.handleCallback(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Auto Deposit webhook handled successfully",
    data: result,
  });
});

const getAllAutoDeposits = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AutoDepositServices.getAllAutoDeposits(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Auto Deposits retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const AutoDepositControllers = {
  handleCallback,
  getAllAutoDeposits,
};
