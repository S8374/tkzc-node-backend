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
exports.deleteTittle = exports.updateTittle = exports.getSingleTittle = exports.getActiveTittlesByTab = exports.getAllTittles = exports.createTittle = exports.deleteInstruction = exports.updateInstruction = exports.getPaymentMethodByTab = exports.getInstructionsByType = exports.getAllInstructions = exports.createInstruction = exports.deletePaymentMethod = exports.updatePaymentMethod = exports.getActivePaymentMethods = exports.getAllPaymentMethods = exports.createPaymentMethod = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const deposite_service_1 = require("./deposite.service");
// Create
const createPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.createPaymentMethod(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Payment Method Created Successfully",
        data: result,
    });
});
exports.createPaymentMethod = createPaymentMethod;
// Get All (Admin)
const getAllPaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.getAllPaymentMethods();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: ""
    });
});
exports.getAllPaymentMethods = getAllPaymentMethods;
// Get Active (Frontend)
const getActivePaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.getActivePaymentMethods();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: ""
    });
});
exports.getActivePaymentMethods = getActivePaymentMethods;
// Update
const updatePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.updatePaymentMethod(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Payment Method Updated Successfully",
        data: result,
    });
});
exports.updatePaymentMethod = updatePaymentMethod;
// Delete
const deletePaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield deposite_service_1.PaymentMethodService.deletePaymentMethod(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Payment Method Deleted Successfully",
        data: undefined
    });
});
exports.deletePaymentMethod = deletePaymentMethod;
// Create
const createInstruction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.createInstruction(req.body);
    res.status(http_status_codes_1.default.CREATED).json({
        success: true,
        message: "Instruction created successfully",
        data: result,
    });
});
exports.createInstruction = createInstruction;
// Get All
const getAllInstructions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.getAllInstructions();
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        data: result,
    });
});
exports.getAllInstructions = getAllInstructions;
// Get By Type
const getInstructionsByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tab } = req.params;
    const result = yield deposite_service_1.PaymentMethodService.getInstructionsByType(tab);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        data: result,
    });
});
exports.getInstructionsByType = getInstructionsByType;
// Get By Type
const getPaymentMethodByTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tab } = req.params;
    const result = yield deposite_service_1.PaymentMethodService.getPaymentMethodByTab(tab);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        data: result,
    });
});
exports.getPaymentMethodByTab = getPaymentMethodByTab;
// Update
const updateInstruction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.updateInstruction(req.params.id, req.body);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Instruction updated successfully",
        data: result,
    });
});
exports.updateInstruction = updateInstruction;
// Delete
const deleteInstruction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield deposite_service_1.PaymentMethodService.deleteInstruction(req.params.id);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Instruction deleted successfully",
    });
});
exports.deleteInstruction = deleteInstruction;
// Create
const createTittle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.createTittle(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Tittle created successfully",
        data: result,
    });
});
exports.createTittle = createTittle;
// Get All (Admin)
const getAllTittles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield deposite_service_1.PaymentMethodService.getAllTittles();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: ""
    });
});
exports.getAllTittles = getAllTittles;
// Get Active by Tab (Frontend)
const getActiveTittlesByTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tab } = req.params;
    const result = yield deposite_service_1.PaymentMethodService.getActiveTittlesByTab(tab);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: ""
    });
});
exports.getActiveTittlesByTab = getActiveTittlesByTab;
// Get Single
const getSingleTittle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield deposite_service_1.PaymentMethodService.getSingleTittle(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: ""
    });
});
exports.getSingleTittle = getSingleTittle;
// Update
const updateTittle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield deposite_service_1.PaymentMethodService.updateTittle(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Tittle updated successfully",
        data: result,
    });
});
exports.updateTittle = updateTittle;
// Delete
const deleteTittle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield deposite_service_1.PaymentMethodService.deleteTittle(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Tittle deleted successfully",
        data: null,
    });
});
exports.deleteTittle = deleteTittle;
