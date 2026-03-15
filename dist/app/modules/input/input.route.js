"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputRoutes = void 0;
// src/modules/otp/otp.routes.ts
const express_1 = __importDefault(require("express"));
const input_controller_1 = require("./input.controller");
const router = express_1.default.Router();
router.post("/", input_controller_1.createFormField);
router.get("/:paymentMethodId", input_controller_1.getFormFields);
router.put("/:id", input_controller_1.updateFormField);
router.delete("/:id", input_controller_1.deleteFormField);
router.get("/tab/:tab", input_controller_1.getFromInputByType);
exports.inputRoutes = router;
