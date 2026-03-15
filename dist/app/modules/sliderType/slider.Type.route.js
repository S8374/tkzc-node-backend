"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliderTypeRoutes = void 0;
const express_1 = require("express");
const sliderType_controller_1 = require("./sliderType.controller");
const router = (0, express_1.Router)();
router.post("/", sliderType_controller_1.createSliderType); // Create
router.get("/", sliderType_controller_1.getSliderTypes); // Read all
router.get("/get-all-type-with-slider", sliderType_controller_1.getSliderTypesWithSlider); // Read all
router.get("/:id", sliderType_controller_1.getSliderType); // Read single
router.put("/:id", sliderType_controller_1.updateSliderType); // Update
router.delete("/:id", sliderType_controller_1.deleteSliderType); // Delete
exports.sliderTypeRoutes = router;
