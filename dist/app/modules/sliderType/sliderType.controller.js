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
exports.deleteSliderType = exports.updateSliderType = exports.getSliderType = exports.getSliderTypesWithSlider = exports.getSliderTypes = exports.createSliderType = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const sliderType_service_1 = require("./sliderType.service");
const createSliderType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = yield sliderType_service_1.SliderTypeService.createSliderType(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Slider Type Created",
        data: type
    });
});
exports.createSliderType = createSliderType;
const getSliderTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield sliderType_service_1.SliderTypeService.getAllSliderTypes();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: types,
        message: ""
    });
});
exports.getSliderTypes = getSliderTypes;
const getSliderTypesWithSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield sliderType_service_1.SliderTypeService.getAllSliderTypesWithSlider();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: types,
        message: ""
    });
});
exports.getSliderTypesWithSlider = getSliderTypesWithSlider;
const getSliderType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = yield sliderType_service_1.SliderTypeService.getSliderTypeById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: type,
        message: ""
    });
});
exports.getSliderType = getSliderType;
const updateSliderType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = yield sliderType_service_1.SliderTypeService.updateSliderType(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Slider Type Updated",
        data: type
    });
});
exports.updateSliderType = updateSliderType;
const deleteSliderType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sliderType_service_1.SliderTypeService.deleteSliderType(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Slider Type Deleted",
        data: undefined
    });
});
exports.deleteSliderType = deleteSliderType;
