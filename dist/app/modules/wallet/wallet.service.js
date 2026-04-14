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
exports.WalletServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("./wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const updateWallet = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const newWalletPassword = payload.newWalletPassword || payload.walletPassword;
    // Set/Update withdraw password
    if (newWalletPassword) {
        if (wallet.walletPassword && !payload.currentWalletPassword) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current withdraw password is required");
        }
        if (wallet.walletPassword && payload.currentWalletPassword) {
            const isCurrentPasswordMatched = yield bcryptjs_1.default.compare(payload.currentWalletPassword, wallet.walletPassword);
            if (!isCurrentPasswordMatched) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current withdraw password is incorrect");
            }
        }
        const hashedWalletPass = yield bcryptjs_1.default.hash(newWalletPassword, 10);
        wallet.walletPassword = hashedWalletPass;
    }
    const isAddressMutation = Boolean(payload.walletAddress || payload.protocol || payload.clearWalletAddress);
    if (isAddressMutation) {
        if (!wallet.walletPassword) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please set withdraw password first");
        }
        if (!payload.currentWalletPassword) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Withdraw password is required");
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(payload.currentWalletPassword, wallet.walletPassword);
        if (!isPasswordMatched) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid withdraw password");
        }
    }
    if (payload.clearWalletAddress) {
        wallet.walletAddress = undefined;
        wallet.protocol = undefined;
    }
    if (payload.walletAddress) {
        wallet.walletAddress = payload.walletAddress;
    }
    if (payload.protocol) {
        wallet.protocol = payload.protocol;
    }
    yield wallet.save();
    return wallet;
});
// Get wallet by user ID
const getWalletByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching wallet for user ID:", userId); // Debug log
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found for this user");
    }
    return wallet;
});
exports.WalletServices = { updateWallet, getWalletByUser };
