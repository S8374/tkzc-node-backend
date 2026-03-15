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
exports.CryptoExchangeService = void 0;
const cryptoExchange_model_1 = require("./cryptoExchange.model");
// Create
const createExchange = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cryptoExchange_model_1.CryptoExchangeModel.create(payload);
});
// Get All (admin)
const getAllExchanges = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield cryptoExchange_model_1.CryptoExchangeModel.find().sort({ order: 1 });
});
// Get Active (frontend)
const getActiveExchanges = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield cryptoExchange_model_1.CryptoExchangeModel.find({ isActive: true }).sort({ order: 1 });
});
// Update
const updateExchange = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cryptoExchange_model_1.CryptoExchangeModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deleteExchange = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cryptoExchange_model_1.CryptoExchangeModel.findByIdAndDelete(id);
});
exports.CryptoExchangeService = {
    createExchange,
    getAllExchanges,
    getActiveExchanges,
    updateExchange,
    deleteExchange,
};
