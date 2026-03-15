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
exports.PromotionService = void 0;
const promotion_modal_1 = require("./promotion.modal");
// Create
const createPromotion = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.create(payload);
});
// Get All
const getAllPromotions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.find().sort({ createdAt: -1 });
});
// Get By Tab (Frontend)
const getPromotionsByTab = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.find({
        tab,
        isActive: true,
    });
});
// Get Single
const getSinglePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.findById(id);
});
// Update
const updatePromotion = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deletePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield promotion_modal_1.PromotionModel.findByIdAndDelete(id);
});
exports.PromotionService = {
    createPromotion,
    getAllPromotions,
    getPromotionsByTab,
    getSinglePromotion,
    updatePromotion,
    deletePromotion,
};
