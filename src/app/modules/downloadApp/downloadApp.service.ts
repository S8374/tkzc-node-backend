import { IDownloadApp } from "./downloadApp.interface";
import { DownloadAppModel } from "./downloadApp.model";

const createDownloadApp = async (payload: IDownloadApp) => {
  return await DownloadAppModel.create(payload);
};

const getAllDownloadApps = async () => {
  return await DownloadAppModel.find().sort({ category: 1, order: 1, createdAt: -1 });
};

const getActiveDownloadApps = async () => {
  return await DownloadAppModel.find({ isActive: true }).sort({ category: 1, order: 1, createdAt: -1 });
};

const updateDownloadApp = async (id: string, payload: Partial<IDownloadApp>) => {
  return await DownloadAppModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteDownloadApp = async (id: string) => {
  return await DownloadAppModel.findByIdAndDelete(id);
};

export const DownloadAppService = {
  createDownloadApp,
  getAllDownloadApps,
  getActiveDownloadApps,
  updateDownloadApp,
  deleteDownloadApp,
};
