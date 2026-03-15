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
exports.deleteExchange = exports.updateExchange = exports.getActiveExchanges = exports.getAllExchanges = exports.createExchange = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const cryptoExchange_service_1 = require("./cryptoExchange.service");
// Create
const createExchange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cryptoExchange_service_1.CryptoExchangeService.createExchange(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Exchange created successfully",
        data: result,
    });
});
exports.createExchange = createExchange;
// Get all
const getAllExchanges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cryptoExchange_service_1.CryptoExchangeService.getAllExchanges();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getAllExchanges = getAllExchanges;
// Get active
const getActiveExchanges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cryptoExchange_service_1.CryptoExchangeService.getActiveExchanges();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getActiveExchanges = getActiveExchanges;
// Update
const updateExchange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cryptoExchange_service_1.CryptoExchangeService.updateExchange(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Exchange updated successfully",
        data: result,
    });
});
exports.updateExchange = updateExchange;
// Delete
const deleteExchange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield cryptoExchange_service_1.CryptoExchangeService.deleteExchange(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Exchange deleted successfully",
        data: null,
    });
});
exports.deleteExchange = deleteExchange;
