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
exports.SupportService = void 0;
const support_model_1 = require("./support.model");
// Create
const createSupport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield support_model_1.SupportModel.create(payload);
});
// Get all (admin)
const getAllSupports = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield support_model_1.SupportModel.find().sort({ order: 1 });
});
// Get active (frontend)
const getActiveSupports = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield support_model_1.SupportModel.find({ isActive: true }).sort({ order: 1 });
});
// Update
const updateSupport = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield support_model_1.SupportModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deleteSupport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield support_model_1.SupportModel.findByIdAndDelete(id);
});
exports.SupportService = {
    createSupport,
    getAllSupports,
    getActiveSupports,
    updateSupport,
    deleteSupport,
};
