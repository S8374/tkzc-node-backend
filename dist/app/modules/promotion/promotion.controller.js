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
exports.deletePromotion = exports.updatePromotion = exports.getPromotionsByTab = exports.getAllPromotions = exports.createPromotion = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const promotion_service_1 = require("./promotion.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createPromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promotion_service_1.PromotionService.createPromotion(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Promotion created successfully",
        data: result,
    });
});
exports.createPromotion = createPromotion;
const getAllPromotions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promotion_service_1.PromotionService.getAllPromotions();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getAllPromotions = getAllPromotions;
const getPromotionsByTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tab } = req.params;
    const result = yield promotion_service_1.PromotionService.getPromotionsByTab(tab);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getPromotionsByTab = getPromotionsByTab;
const updatePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promotion_service_1.PromotionService.updatePromotion(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Promotion updated successfully",
        data: result,
    });
});
exports.updatePromotion = updatePromotion;
const deletePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield promotion_service_1.PromotionService.deletePromotion(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Promotion deleted successfully",
        data: undefined,
    });
});
exports.deletePromotion = deletePromotion;
