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
exports.deletePartner = exports.updatePartner = exports.getActivePartners = exports.getAllPartners = exports.createPartner = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const partner_service_1 = require("./partner.service");
// Create
const createPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield partner_service_1.PartnerService.createPartner(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Partner created successfully",
        data: result,
    });
});
exports.createPartner = createPartner;
// Admin Get All
const getAllPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield partner_service_1.PartnerService.getAllPartners();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getAllPartners = getAllPartners;
// Frontend Get Active
const getActivePartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield partner_service_1.PartnerService.getActivePartners();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: result,
        message: "",
    });
});
exports.getActivePartners = getActivePartners;
// Update
const updatePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield partner_service_1.PartnerService.updatePartner(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Partner updated successfully",
        data: result,
    });
});
exports.updatePartner = updatePartner;
// Delete
const deletePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield partner_service_1.PartnerService.deletePartner(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Partner deleted successfully",
        data: undefined,
    });
});
exports.deletePartner = deletePartner;
