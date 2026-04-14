"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadAppService = void 0;
const downloadApp_model_1 = require("./downloadApp.model");
const createDownloadApp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield downloadApp_model_1.DownloadAppModel.create(payload);
});
const getAllDownloadApps = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield downloadApp_model_1.DownloadAppModel.find().sort({ category: 1, order: 1, createdAt: -1 });
});
const getActiveDownloadApps = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield downloadApp_model_1.DownloadAppModel.find({ isActive: true }).sort({ category: 1, order: 1, createdAt: -1 });
});
const updateDownloadApp = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield downloadApp_model_1.DownloadAppModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
const deleteDownloadApp = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield downloadApp_model_1.DownloadAppModel.findByIdAndDelete(id);
});
exports.DownloadAppService = {
    createDownloadApp,
    getAllDownloadApps,
    getActiveDownloadApps,
    updateDownloadApp,
    deleteDownloadApp,
};
