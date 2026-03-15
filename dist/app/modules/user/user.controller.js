"use strict";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
const setCookie_1 = require("../../utils/setCookie");
const wallet_service_1 = require("../wallet/wallet.service");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("User hits  ", req.body);
    const user = yield user_service_1.UserServices.createUser(req.body);
    // ✅ Set cookies
    (0, setCookie_1.setAuthCookie)(res, {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
}));
// Get Wallet (Protected)
const getWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        // do NOT return res here; just send response
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized access",
        });
        return; // exit function
    }
    const wallet = yield wallet_service_1.WalletServices.getWalletByUser(userId);
    // ✅ Just call sendResponse, don't return it
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Wallet fetched successfully",
        data: wallet,
    });
}));
exports.UserControllers = {
    createUser,
    getWallet
};
