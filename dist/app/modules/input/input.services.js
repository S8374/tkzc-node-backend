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
exports.FormFieldService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const input_model_1 = require("./input.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Create
const createField = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tab = (_a = payload.tab) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    const isBonus = !!payload.isBonusField;
    if (!tab)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tab is required");
    // ✅ Bonus field validation
    if (isBonus) {
        const existingBonus = yield input_model_1.FormFieldModel.findOne({
            tab,
            isBonusField: true,
        });
        if (existingBonus) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Bonus field already exists for tab "${tab}"`);
        }
    }
    return yield input_model_1.FormFieldModel.create(Object.assign(Object.assign({}, payload), { tab, isBonusField: isBonus }));
});
// Get by payment method
const getFieldsByPaymentMethod = (paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield input_model_1.FormFieldModel.find({
        paymentMethodId,
        isActive: true,
    }).sort({ order: 1 });
});
const getInputByTab = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    return yield input_model_1.FormFieldModel.find({ tab }).sort({ order: 1 });
});
// Update
const updateField = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.isBonusField) {
        const field = yield input_model_1.FormFieldModel.findById(id);
        const existingBonus = yield input_model_1.FormFieldModel.findOne({
            tab: field === null || field === void 0 ? void 0 : field.tab,
            isBonusField: true,
            _id: { $ne: id }, // ignore current field
        });
        if (existingBonus) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Bonus field already exists for tab "${field === null || field === void 0 ? void 0 : field.tab}"`);
        }
    }
    return yield input_model_1.FormFieldModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
});
// Delete
const deleteField = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield input_model_1.FormFieldModel.findByIdAndDelete(id);
});
exports.FormFieldService = {
    createField,
    getFieldsByPaymentMethod,
    updateField,
    deleteField,
    getInputByTab
};
