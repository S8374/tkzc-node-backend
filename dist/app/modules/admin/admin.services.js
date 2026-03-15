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
exports.UserServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, page = 1, limit = 10 } = query;
    const filter = { isDeleted: false };
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const users = yield user_model_1.User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    const total = yield user_model_1.User.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: users,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user)
        throw new AppError_1.default(404, "User not found");
    return user;
});
const changeUserStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { isActive: status }, { new: true });
    console.log("users....", user);
    if (!user)
        throw new AppError_1.default(404, "User not found");
    return user;
});
const changeUserRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user)
        throw new AppError_1.default(404, "User not found");
    return user;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user)
        throw new AppError_1.default(404, "User not found");
    return user;
});
// Add this service method
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        picture: payload.picture,
        referralCode: payload.referralCode,
        isVerified: payload.isVerified
    }, { new: true, runValidators: true }).select("-password");
    if (!user)
        throw new AppError_1.default(404, "User not found");
    return user;
});
exports.UserServices = {
    getAllUsers,
    getSingleUser,
    changeUserStatus,
    changeUserRole,
    deleteUser,
    updateUser
};
