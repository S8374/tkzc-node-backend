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
exports.marqueeService = void 0;
const marquee_model_1 = require("./marquee.model");
const createMarquee = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield marquee_model_1.Marquee.create(payload);
});
const getAllMarquees = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield marquee_model_1.Marquee.find().sort({ order: 1 });
});
const getActiveMarquees = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    return yield marquee_model_1.Marquee.find({
        isActive: true,
        $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: now } },
        ],
        $and: [
            {
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gte: now } },
                ],
            },
        ],
    }).sort({ order: 1 });
});
const updateMarquee = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield marquee_model_1.Marquee.findByIdAndUpdate(id, payload, {
        new: true,
    });
});
const deleteMarquee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield marquee_model_1.Marquee.findByIdAndDelete(id);
});
exports.marqueeService = {
    createMarquee,
    getAllMarquees,
    getActiveMarquees,
    updateMarquee,
    deleteMarquee,
};
