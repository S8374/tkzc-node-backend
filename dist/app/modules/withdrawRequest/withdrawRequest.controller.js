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
exports.WithdrawRequestController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const withdrawRequest_interface_1 = require("./withdrawRequest.interface");
const withdrawRequest_service_1 = require("./withdrawRequest.service");
const getWithdrawEligibility = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield withdrawRequest_service_1.WithdrawRequestService.getWithdrawEligibility(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdraw eligibility retrieved successfully",
        data: result,
    });
}));
const createWithdrawRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield withdrawRequest_service_1.WithdrawRequestService.createWithdrawRequest(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Withdraw request submitted successfully",
        data: result,
    });
}));
const getAllWithdrawRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawRequest_service_1.WithdrawRequestService.getAllWithdrawRequests(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdraw requests retrieved successfully",
        data: result,
    });
}));
const getUserWithdrawRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield withdrawRequest_service_1.WithdrawRequestService.getUserWithdrawRequests(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My withdraw requests retrieved successfully",
        data: result,
    });
}));
const getSingleWithdrawRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawRequest_service_1.WithdrawRequestService.getSingleWithdrawRequest(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdraw request retrieved successfully",
        data: result,
    });
}));
const approveWithdrawRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { adminNote, adminSenderNumber, adminTransactionId } = req.body;
    const result = yield withdrawRequest_service_1.WithdrawRequestService.processWithdrawRequest(req.params.id, adminId, withdrawRequest_interface_1.WithdrawStatus.APPROVED, { adminNote, adminSenderNumber, adminTransactionId });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdraw request approved successfully",
        data: result,
    });
}));
const rejectWithdrawRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { adminNote, adminSenderNumber, adminTransactionId } = req.body;
    const result = yield withdrawRequest_service_1.WithdrawRequestService.processWithdrawRequest(req.params.id, adminId, withdrawRequest_interface_1.WithdrawStatus.REJECTED, { adminNote, adminSenderNumber, adminTransactionId });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdraw request rejected successfully",
        data: result,
    });
}));
const cancelWithdrawRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield withdrawRequest_service_1.WithdrawRequestService.cancelWithdrawRequest(req.params.id, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Withdraw request cancelled successfully",
        data: result,
    });
}));
exports.WithdrawRequestController = {
    getWithdrawEligibility,
    createWithdrawRequest,
    getAllWithdrawRequests,
    getUserWithdrawRequests,
    getSingleWithdrawRequest,
    approveWithdrawRequest,
    rejectWithdrawRequest,
    cancelWithdrawRequest,
};
