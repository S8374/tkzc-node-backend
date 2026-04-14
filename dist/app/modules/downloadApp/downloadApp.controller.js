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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDownloadApp = exports.updateDownloadApp = exports.getActiveDownloadApps = exports.getAllDownloadApps = exports.createDownloadApp = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const downloadApp_service_1 = require("./downloadApp.service");
const createDownloadApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield downloadApp_service_1.DownloadAppService.createDownloadApp(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Download app created successfully",
        data: result,
    });
});
exports.createDownloadApp = createDownloadApp;
const getAllDownloadApps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield downloadApp_service_1.DownloadAppService.getAllDownloadApps();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getAllDownloadApps = getAllDownloadApps;
const getActiveDownloadApps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield downloadApp_service_1.DownloadAppService.getActiveDownloadApps();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getActiveDownloadApps = getActiveDownloadApps;
const updateDownloadApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield downloadApp_service_1.DownloadAppService.updateDownloadApp(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Download app updated successfully",
        data: result,
    });
});
exports.updateDownloadApp = updateDownloadApp;
const deleteDownloadApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield downloadApp_service_1.DownloadAppService.deleteDownloadApp(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Download app deleted successfully",
        data: null,
    });
});
exports.deleteDownloadApp = deleteDownloadApp;
