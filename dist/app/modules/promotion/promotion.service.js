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
exports.PromotionService = void 0;
const deposite_model_1 = require("../deposite/deposite.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const promotion_modal_1 = require("./promotion.modal");
// Create
const createPromotion = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate maxBonus if provided
    if (payload.maxBonus && payload.maxBonus < 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Maximum bonus cannot be negative");
    }
    // Validate value
    if (payload.value <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Bonus value must be greater than 0");
    }
    // Validate paymentMethodId if provided
    if (payload.paymentMethodId) {
        const paymentMethod = yield deposite_model_1.PaymentMethodModel.findById(payload.paymentMethodId);
        if (!paymentMethod) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment method not found");
        }
        // Check if payment method belongs to the same tab
        if (paymentMethod.tab !== payload.tab) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Payment method "${paymentMethod.name}" belongs to tab "${paymentMethod.tab}", not "${payload.tab}"`);
        }
    }
    return yield promotion_modal_1.PromotionModel.create(payload);
});
// Get All
const getAllPromotions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.find()
        .populate("paymentMethodId", "name icon tab")
        .sort({ createdAt: -1 });
});
// Get By Tab (Frontend)
const getPromotionsByTab = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.find({
        tab,
        isActive: true,
    })
        .populate("paymentMethodId", "name icon")
        .sort({ createdAt: -1 });
});
// Get By Payment Method
const getPromotionsByPaymentMethod = (paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate payment method exists
    const paymentMethod = yield deposite_model_1.PaymentMethodModel.findById(paymentMethodId);
    if (!paymentMethod) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment method not found");
    }
    return yield promotion_modal_1.PromotionModel.find({
        paymentMethodId,
        isActive: true,
    }).populate("paymentMethodId", "name icon").sort({ createdAt: -1 });
});
// Get Single
const getSinglePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const promotion = yield promotion_modal_1.PromotionModel.findById(id).populate("paymentMethodId", "name icon tab");
    if (!promotion) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Promotion not found");
    }
    return promotion;
});
// Update
const updatePromotion = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate maxBonus if provided
    if (payload.maxBonus && payload.maxBonus < 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Maximum bonus cannot be negative");
    }
    // Validate value if provided
    if (payload.value && payload.value <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Bonus value must be greater than 0");
    }
    // Validate paymentMethodId if provided
    if (payload.paymentMethodId) {
        const paymentMethod = yield deposite_model_1.PaymentMethodModel.findById(payload.paymentMethodId);
        if (!paymentMethod) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment method not found");
        }
        // Get current promotion to check tab
        const currentPromotion = yield promotion_modal_1.PromotionModel.findById(id);
        const tabToUse = payload.tab || (currentPromotion === null || currentPromotion === void 0 ? void 0 : currentPromotion.tab);
        if (paymentMethod.tab !== tabToUse) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Payment method "${paymentMethod.name}" belongs to tab "${paymentMethod.tab}", not "${tabToUse}"`);
        }
    }
    const updatedPromotion = yield promotion_modal_1.PromotionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("paymentMethodId", "name icon");
    if (!updatedPromotion) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Promotion not found");
    }
    return updatedPromotion;
});
// Delete
const deletePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const promotion = yield promotion_modal_1.PromotionModel.findByIdAndDelete(id);
    if (!promotion) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Promotion not found");
    }
    return promotion;
});
exports.PromotionService = {
    createPromotion,
    getAllPromotions,
    getPromotionsByTab,
    getPromotionsByPaymentMethod,
    getSinglePromotion,
    updatePromotion,
    deletePromotion,
};
