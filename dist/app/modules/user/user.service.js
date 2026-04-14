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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("./user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const userTokens_1 = require("../../utils/userTokens");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, referralCode: incomingReferralCode, imHuman } = payload, rest = __rest(payload, ["name", "email", "password", "referralCode", "imHuman"]);
    if (!name || !password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Username and password are required");
    }
    // Normalize email: treat empty string as undefined
    const normalizedEmail = (email === null || email === void 0 ? void 0 : email.trim()) ? email.trim().toLowerCase() : undefined;
    // Check username uniqueness
    const isNameExist = yield user_model_1.User.findOne({ name });
    if (isNameExist)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Username already exists");
    // Check email only if provided
    if (normalizedEmail) {
        const isEmailExist = yield user_model_1.User.findOne({ email: normalizedEmail });
        if (isEmailExist)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email already exists");
    }
    // Find referring user if code provided
    let referredBy;
    if (incomingReferralCode) {
        const referrer = yield user_model_1.User.findOne({ referralCode: incomingReferralCode });
        if (referrer) {
            referredBy = referrer._id;
        }
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = { provider: "credentials", providerId: name };
    // Generate unique referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user = yield user_model_1.User.create(Object.assign({ name, email: normalizedEmail, password: hashedPassword, referralCode: newReferralCode, referredBy, imHuman: !!imHuman, auths: [authProvider] }, rest));
    const userTokens = (0, userTokens_1.createUserTokens)(user);
    yield wallet_model_1.Wallet.create({ user: user._id, balance: 0 });
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user
    };
});
const getUserStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const directSubordinatesCount = yield user_model_1.User.countDocuments({ referredBy: userId });
    return {
        directSubordinatesCount,
        newDirectSubordinatesCount: 0,
    };
});
const updateCurrentUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (payload.email !== undefined) {
        if (!payload.currentPassword) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current password is required to update email");
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(payload.currentPassword, user.password);
        if (!isPasswordMatched) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current password is incorrect");
        }
        const normalizedEmail = payload.email.trim().toLowerCase();
        if (!normalizedEmail) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email is required");
        }
        const emailExists = yield user_model_1.User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
        if (emailExists) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email already exists");
        }
        user.email = normalizedEmail;
    }
    if (payload.name !== undefined && payload.name.trim()) {
        const nameExists = yield user_model_1.User.findOne({ name: payload.name.trim(), _id: { $ne: userId } });
        if (nameExists) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Username already exists");
        }
        user.name = payload.name.trim();
    }
    if (payload.phone !== undefined) {
        user.phone = payload.phone;
    }
    if (payload.address !== undefined) {
        user.address = payload.address;
    }
    yield user.save();
    const updatedUser = yield user_model_1.User.findById(userId).select("-password -__v");
    return updatedUser;
});
const changeLoginPassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(payload.currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current password is incorrect");
    }
    user.password = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
    return true;
});
exports.UserServices = { createUser, getUserStats, updateCurrentUser, changeLoginPassword };
