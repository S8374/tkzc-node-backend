import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { DownloadAppService } from "./downloadApp.service";

export const createDownloadApp = async (req: Request, res: Response) => {
  const result = await DownloadAppService.createDownloadApp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Download app created successfully",
    data: result,
  });
};

export const getAllDownloadApps = async (req: Request, res: Response) => {
  const result = await DownloadAppService.getAllDownloadApps();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

export const getActiveDownloadApps = async (req: Request, res: Response) => {
  const result = await DownloadAppService.getActiveDownloadApps();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "",
  });
};

export const updateDownloadApp = async (req: Request, res: Response) => {
  const result = await DownloadAppService.updateDownloadApp(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Download app updated successfully",
    data: result,
  });
};

export const deleteDownloadApp = async (req: Request, res: Response) => {
  await DownloadAppService.deleteDownloadApp(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Download app deleted successfully",
    data: null,
  });
};
