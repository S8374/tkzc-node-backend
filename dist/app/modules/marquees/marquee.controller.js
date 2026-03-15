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
exports.marqueeController = void 0;
const marquee_service_1 = require("./marquee.service");
const createMarquee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield marquee_service_1.marqueeService.createMarquee(req.body);
        res.status(201).json({
            success: true,
            message: "Marquee created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create marquee",
            error,
        });
    }
});
const getAllMarquees = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield marquee_service_1.marqueeService.getAllMarquees();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch marquees",
            error,
        });
    }
});
const getActiveMarquees = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield marquee_service_1.marqueeService.getActiveMarquees();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch active marquees",
            error,
        });
    }
});
const updateMarquee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield marquee_service_1.marqueeService.updateMarquee(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Marquee updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update marquee",
            error,
        });
    }
});
const deleteMarquee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield marquee_service_1.marqueeService.deleteMarquee(req.params.id);
        res.status(200).json({
            success: true,
            message: "Marquee deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete marquee",
            error,
        });
    }
});
exports.marqueeController = {
    createMarquee,
    getAllMarquees,
    getActiveMarquees,
    updateMarquee,
    deleteMarquee,
};
