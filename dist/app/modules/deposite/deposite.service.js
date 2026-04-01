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
exports.PaymentMethodService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const deposite_model_1 = require("./deposite.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Create
const createPaymentMethod = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.create(payload);
});
// Get All (Admin)
const getAllPaymentMethods = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.find().sort({ order: 1 });
});
// Get Active (Frontend)
const getActivePaymentMethods = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.find({ isActive: true }).sort({ order: 1 });
});
const getPaymentMethodByTab = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.find({ tab, isActive: true }).sort({ order: 1 });
});
// Get Single
const getSinglePaymentMethod = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.findById(id);
});
// Update
const updatePaymentMethod = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deletePaymentMethod = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.PaymentMethodModel.findByIdAndDelete(id);
});
// Get All
const getAllInstructions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.InstructionModel.find().sort({ step: 1 });
});
//New 
// Create instruction with payment method validation
const createInstruction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield deposite_model_1.InstructionModel.create(payload);
});
// Get instructions by payment method
const getInstructionsByPaymentMethod = (paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate payment method exists
    const paymentMethod = yield deposite_model_1.PaymentMethodModel.findById(paymentMethodId);
    if (!paymentMethod) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment method not found");
    }
    return yield deposite_model_1.InstructionModel.find({
        paymentMethodId,
        isActive: true,
    }).sort({ step: 1 });
});
// Get instructions by type (existing - modified)
const getInstructionsByType = (tab, paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = { tab, isActive: true };
    if (paymentMethodId) {
        filter.paymentMethodId = paymentMethodId;
    }
    return yield deposite_model_1.InstructionModel.find(filter).sort({ step: 1 });
});
// Get Single
const getSingleInstruction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.InstructionModel.findById(id);
});
// Update
const updateInstruction = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.InstructionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deleteInstruction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.InstructionModel.findByIdAndDelete(id);
});
// Create with unique tab check
const createTittle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if a Tittle already exists for this tab
    const existing = yield deposite_model_1.TittleModel.findOne({ tab: payload.tab });
    if (existing) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `A Tittle already exists for tab "${payload.tab}". Only one allowed per tab.`);
    }
    return yield deposite_model_1.TittleModel.create(payload);
});
// Get All
const getAllTittles = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.TittleModel.find().sort({ createdAt: -1 });
});
// Get Active by Tab
const getActiveTittlesByTab = (tab) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.TittleModel.find({ tab, isActive: true }).sort({ createdAt: -1 });
});
// Get Single
const getSingleTittle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.TittleModel.findById(id);
});
// Update (optional: also prevent changing tab to duplicate)
const updateTittle = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.tab) {
        const existing = yield deposite_model_1.TittleModel.findOne({ tab: payload.tab, _id: { $ne: id } });
        if (existing) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Another Tittle already exists for tab "${payload.tab}". Only one allowed per tab.`);
        }
    }
    return yield deposite_model_1.TittleModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deleteTittle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield deposite_model_1.TittleModel.findByIdAndDelete(id);
});
exports.PaymentMethodService = {
    createPaymentMethod,
    getAllPaymentMethods,
    getActivePaymentMethods,
    getSinglePaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    createInstruction,
    getAllInstructions,
    getInstructionsByType,
    getSingleInstruction,
    updateInstruction,
    deleteInstruction,
    getPaymentMethodByTab,
    createTittle,
    getAllTittles,
    getActiveTittlesByTab,
    getSingleTittle,
    updateTittle,
    deleteTittle,
    getInstructionsByPaymentMethod,
};
