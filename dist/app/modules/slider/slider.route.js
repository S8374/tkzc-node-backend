"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const slider_controller_1 = require("./slider.controller");
const router = express_1.default.Router();
// // Admin routes
// router.post("/", createSlider);
// router.put("/:id", updateSlider);
// router.delete("/:id", deleteSlider);
// // Public routes
// router.get("/", getSliders);              // ?type=hero
// router.get("/:id", getSingleSlider);
router.post("/", slider_controller_1.createSlider);
router.get("/", slider_controller_1.getSliders); // MUST come before /:id
router.get("/:id", slider_controller_1.getSingleSlider);
router.patch("/:id", slider_controller_1.updateSlider);
router.delete("/:id", slider_controller_1.deleteSlider);
exports.SliderRoutes = router;
