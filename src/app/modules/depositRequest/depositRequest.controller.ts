import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { DepositRequestService } from "./depositRequest.service";
import { DepositStatus } from "./depositRequest.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createDepositRequest = catchAsync(async (req: Request, res: Response) => {
    console.log("req.user",req.user);
  const userId = req.user?.userId; // Assuming you have auth middleware
  const result = await DepositRequestService.createDepositRequest(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Deposit request submitted successfully",
    data: result,
  });
});

const getAllDepositRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await DepositRequestService.getAllDepositRequests(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposit requests retrieved successfully",
    data: result,
  });
});

const getUserDepositRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await DepositRequestService.getUserDepositRequests(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
});

const getSingleDepositRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await DepositRequestService.getSingleDepositRequest(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
});

const approveDepositRequest = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.userId;
  const { adminNote, bonusAmount, turnoverRequired } = req.body;
  
  const result = await DepositRequestService.processDepositRequest(
    req.params.id,
    adminId,
    DepositStatus.APPROVED,
    adminNote,
    bonusAmount,
    turnoverRequired
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposit request approved successfully",
    data: result,
  });
});

const rejectDepositRequest = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.userId;
  const { adminNote } = req.body;
  
  const result = await DepositRequestService.processDepositRequest(
    req.params.id,
    adminId,
    DepositStatus.REJECTED,
    adminNote
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposit request rejected successfully",
    data: result,
  });
});

const deleteDepositRequest = catchAsync(async (req: Request, res: Response) => {
  await DepositRequestService.deleteDepositRequest(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposit request deleted successfully",
    data: undefined,
  });
});

export const DepositRequestController = {
  createDepositRequest,
  getAllDepositRequests,
  getUserDepositRequests,
  getSingleDepositRequest,
  approveDepositRequest,
  rejectDepositRequest,
  deleteDepositRequest,
};