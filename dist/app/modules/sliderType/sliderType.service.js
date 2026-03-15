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
exports.SliderTypeService = void 0;
const slider_model_1 = require("../slider/slider.model");
const sliderType_model_1 = require("./sliderType.model");
const createSliderType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sliderType_model_1.SliderTypeModel.create(payload);
});
const getAllSliderTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield sliderType_model_1.SliderTypeModel.find({}).sort({ createdAt: -1 });
});
const getAllSliderTypesWithSlider = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch types
    const types = yield sliderType_model_1.SliderTypeModel.find();
    console.log(types);
    // Populate sliders for each type
    const typesWithSliders = yield Promise.all(types.map((type) => __awaiter(void 0, void 0, void 0, function* () {
        const sliders = yield slider_model_1.SliderModel.find({
            sliderTypeId: type._id.toString(),
        }).sort({ order: 1 });
        console.log(sliders);
        return Object.assign(Object.assign({}, type.toObject()), { sliders });
    })));
    return typesWithSliders;
});
const getSliderTypeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sliderType = yield sliderType_model_1.SliderTypeModel.findById(id);
    if (!sliderType)
        return null;
    // Find sliders belonging to this type
    const sliders = yield slider_model_1.SliderModel.find({ sliderTypeId: sliderType._id, isActive: true }).sort({ order: 1 });
    return Object.assign(Object.assign({}, sliderType.toObject()), { sliders });
});
const updateSliderType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sliderType_model_1.SliderTypeModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
});
const deleteSliderType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sliderType_model_1.SliderTypeModel.findByIdAndDelete(id);
});
exports.SliderTypeService = {
    createSliderType,
    getAllSliderTypes,
    getSliderTypeById,
    updateSliderType,
    deleteSliderType,
    getAllSliderTypesWithSlider
};
