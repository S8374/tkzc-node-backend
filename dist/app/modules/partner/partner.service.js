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
exports.PartnerService = void 0;
const partner_model_1 = require("./partner.model");
// Create
const createPartner = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield partner_model_1.PartnerModel.create(payload);
});
// Get All (Admin)
const getAllPartners = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield partner_model_1.PartnerModel.find().sort({ order: 1 });
});
// Get Active (Frontend)
const getActivePartners = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield partner_model_1.PartnerModel.find({ isActive: true }).sort({ order: 1 });
});
// Update
const updatePartner = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield partner_model_1.PartnerModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete
const deletePartner = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield partner_model_1.PartnerModel.findByIdAndDelete(id);
});
exports.PartnerService = {
    createPartner,
    getAllPartners,
    getActivePartners,
    updatePartner,
    deletePartner,
};
