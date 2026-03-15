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
exports.DepositRequestController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const depositRequest_service_1 = require("./depositRequest.service");
const depositRequest_interface_1 = require("./depositRequest.interface");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createDepositRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("req.user", req.user);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming you have auth middleware
    const result = yield depositRequest_service_1.DepositRequestService.createDepositRequest(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Deposit request submitted successfully",
        data: result,
    });
}));
const getAllDepositRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield depositRequest_service_1.DepositRequestService.getAllDepositRequests(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Deposit requests retrieved successfully",
        data: result,
    });
}));
const getUserDepositRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield depositRequest_service_1.DepositRequestService.getUserDepositRequests(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
}));
const getSingleDepositRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield depositRequest_service_1.DepositRequestService.getSingleDepositRequest(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
}));
const approveDepositRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { adminNote } = req.body;
    const result = yield depositRequest_service_1.DepositRequestService.processDepositRequest(req.params.id, adminId, depositRequest_interface_1.DepositStatus.APPROVED, adminNote);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Deposit request approved successfully",
        data: result,
    });
}));
const rejectDepositRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { adminNote } = req.body;
    const result = yield depositRequest_service_1.DepositRequestService.processDepositRequest(req.params.id, adminId, depositRequest_interface_1.DepositStatus.REJECTED, adminNote);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Deposit request rejected successfully",
        data: result,
    });
}));
const deleteDepositRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield depositRequest_service_1.DepositRequestService.deleteDepositRequest(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Deposit request deleted successfully",
        data: undefined,
    });
}));
exports.DepositRequestController = {
    createDepositRequest,
    getAllDepositRequests,
    getUserDepositRequests,
    getSingleDepositRequest,
    approveDepositRequest,
    rejectDepositRequest,
    deleteDepositRequest,
};
