"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marqueeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const marquee_controller_1 = require("./marquee.controller");
const router = express_1.default.Router();
router.post("/", marquee_controller_1.marqueeController.createMarquee);
router.get("/", marquee_controller_1.marqueeController.getAllMarquees);
router.get("/active", marquee_controller_1.marqueeController.getActiveMarquees);
router.patch("/:id", marquee_controller_1.marqueeController.updateMarquee);
router.delete("/:id", marquee_controller_1.marqueeController.deleteMarquee);
exports.marqueeRoutes = router;
