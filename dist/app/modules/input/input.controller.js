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
exports.deleteFormField = exports.updateFormField = exports.getFromInputByType = exports.getFormFields = exports.createFormField = void 0;
const input_services_1 = require("./input.services");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createFormField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield input_services_1.FormFieldService.createField(req.body);
    res.status(201).json({
        success: true,
        message: "Form field created",
        data: result,
    });
});
exports.createFormField = createFormField;
const getFormFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethodId } = req.params;
    const result = yield input_services_1.FormFieldService.getFieldsByPaymentMethod(paymentMethodId);
    res.status(200).json({
        success: true,
        data: result,
    });
});
exports.getFormFields = getFormFields;
const getFromInputByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tab } = req.params;
    const result = yield input_services_1.FormFieldService.getInputByTab(tab);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        data: result,
    });
});
exports.getFromInputByType = getFromInputByType;
const updateFormField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield input_services_1.FormFieldService.updateField(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Field updated",
        data: result,
    });
});
exports.updateFormField = updateFormField;
const deleteFormField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield input_services_1.FormFieldService.deleteField(req.params.id);
    res.status(200).json({
        success: true,
        message: "Field deleted",
    });
});
exports.deleteFormField = deleteFormField;
