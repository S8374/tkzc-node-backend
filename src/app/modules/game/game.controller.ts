import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GameService } from "./game.service";

const handleCallback = catchAsync(async (req: Request, res: Response) => {
  const result = await GameService.handleCallback(req.body);

  sendResponse(res, {
    success: result.success,
    statusCode: httpStatus.OK,
    message: result.message,
    data: result.data,
  });
});

export const GameController = {
  handleCallback,
};
