/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { setAuthCookie } from "../../utils/setCookie";
import { WalletServices } from "../wallet/wallet.service";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log("User hits  ",req.body);

    const user = await UserServices.createUser(req.body);
     // ✅ Set cookies
      setAuthCookie(res, {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})

// Get Wallet (Protected)
const getWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    
  
    const userId = req.user?.userId;

  if (!userId) {
    // do NOT return res here; just send response
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access",
    });
    return; // exit function
  }

  const wallet = await WalletServices.getWalletByUser(userId);

  // ✅ Just call sendResponse, don't return it
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet fetched successfully",
    data: wallet,
  });
});



// Get User Stats (Subordinates)
const getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access",
    });
    return;
  }

  const stats = await UserServices.getUserStats(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User stats fetched successfully",
    data: stats,
  });
});

export const UserControllers = {
    createUser,
    getWallet,
    getUserStats
}

