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
exports.deleteSupport = exports.updateSupport = exports.getActiveSupports = exports.getAllSupports = exports.createSupport = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const support_service_1 = require("./support.service");
// Create
const createSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_service_1.SupportService.createSupport(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Support created successfully",
        data: result,
    });
});
exports.createSupport = createSupport;
// Admin list
const getAllSupports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_service_1.SupportService.getAllSupports();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getAllSupports = getAllSupports;
// Frontend list
const getActiveSupports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_service_1.SupportService.getActiveSupports();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getActiveSupports = getActiveSupports;
// Update
const updateSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield support_service_1.SupportService.updateSupport(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Support updated successfully",
        data: result,
    });
});
exports.updateSupport = updateSupport;
// Delete
const deleteSupport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield support_service_1.SupportService.deleteSupport(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Support deleted successfully",
        data: null,
    });
});
exports.deleteSupport = deleteSupport;
