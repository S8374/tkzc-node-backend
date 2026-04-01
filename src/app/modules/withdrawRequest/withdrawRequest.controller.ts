import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WithdrawStatus } from "./withdrawRequest.interface";
import { WithdrawRequestService } from "./withdrawRequest.service";

const createWithdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await WithdrawRequestService.createWithdrawRequest(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Withdraw request submitted successfully",
    data: result,
  });
});

const getAllWithdrawRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await WithdrawRequestService.getAllWithdrawRequests(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw requests retrieved successfully",
    data: result,
  });
});

const getUserWithdrawRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await WithdrawRequestService.getUserWithdrawRequests(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My withdraw requests retrieved successfully",
    data: result,
  });
});

const getSingleWithdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await WithdrawRequestService.getSingleWithdrawRequest(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw request retrieved successfully",
    data: result,
  });
});

const approveWithdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.userId;
  const { adminNote, adminSenderNumber, adminTransactionId } = req.body;

  const result = await WithdrawRequestService.processWithdrawRequest(
    req.params.id,
    adminId,
    WithdrawStatus.APPROVED,
    { adminNote, adminSenderNumber, adminTransactionId }
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw request approved successfully",
    data: result,
  });
});

const rejectWithdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.userId;
  const { adminNote, adminSenderNumber, adminTransactionId } = req.body;

  const result = await WithdrawRequestService.processWithdrawRequest(
    req.params.id,
    adminId,
    WithdrawStatus.REJECTED,
    { adminNote, adminSenderNumber, adminTransactionId }
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw request rejected successfully",
    data: result,
  });
});

const cancelWithdrawRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await WithdrawRequestService.cancelWithdrawRequest(req.params.id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw request cancelled successfully",
    data: result,
  });
});

export const WithdrawRequestController = {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getUserWithdrawRequests,
  getSingleWithdrawRequest,
  approveWithdrawRequest,
  rejectWithdrawRequest,
  cancelWithdrawRequest,
};
