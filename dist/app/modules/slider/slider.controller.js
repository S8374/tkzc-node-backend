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
exports.deleteSlider = exports.updateSlider = exports.getSingleSlider = exports.getSliders = exports.createSlider = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const slider_service_1 = require("./slider.service");
const createSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slider = yield slider_service_1.SliderService.createSlider(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Slider Created Successfully",
        data: slider,
    });
});
exports.createSlider = createSlider;
const getSliders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sliderTypeId, type } = req.query;
    const sliders = yield slider_service_1.SliderService.getAllSliders({
        sliderTypeId: sliderTypeId,
        type: type,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: sliders,
        message: "",
    });
});
exports.getSliders = getSliders;
const getSingleSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slider = yield slider_service_1.SliderService.getSliderById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: slider,
        message: ""
    });
});
exports.getSingleSlider = getSingleSlider;
const updateSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slider = yield slider_service_1.SliderService.updateSlider(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Slider Updated Successfully",
        data: slider,
    });
});
exports.updateSlider = updateSlider;
const deleteSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield slider_service_1.SliderService.deleteSlider(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Slider Deleted Successfully",
        data: undefined
    });
});
exports.deleteSlider = deleteSlider;
