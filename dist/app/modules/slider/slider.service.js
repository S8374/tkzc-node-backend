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
exports.SliderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const sliderType_model_1 = require("../sliderType/sliderType.model");
const slider_model_1 = require("./slider.model");
const createSlider = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield slider_model_1.SliderModel.create(payload);
});
const getAllSliders = (_a) => __awaiter(void 0, [_a], void 0, function* ({ sliderTypeId, type, }) {
    const query = {};
    // 🔥 If type name is provided
    if (type) {
        const sliderType = yield sliderType_model_1.SliderTypeModel.findOne({ name: type });
        if (!sliderType) {
            return [];
        }
        query.sliderTypeId = sliderType._id.toString();
    }
    // 🔥 If direct ID provided
    if (sliderTypeId) {
        query.sliderTypeId = sliderTypeId;
    }
    return yield slider_model_1.SliderModel.find(query).sort({ order: 1 });
});
const getSliderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield slider_model_1.SliderModel.findById(id);
});
const updateSlider = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield slider_model_1.SliderModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
});
const deleteSlider = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield slider_model_1.SliderModel.findByIdAndDelete(id);
});
exports.SliderService = {
    createSlider,
    getAllSliders,
    getSliderById,
    updateSlider,
    deleteSlider
};
