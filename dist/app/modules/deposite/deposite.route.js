"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositRouter = void 0;
const express_1 = require("express");
const deposite_controller_1 = require("./deposite.controller");
const router = (0, express_1.Router)();
// Admin
router.post("/", deposite_controller_1.createPaymentMethod);
router.get("/all", deposite_controller_1.getAllPaymentMethods);
router.put("/:id", deposite_controller_1.updatePaymentMethod);
router.delete("/:id", deposite_controller_1.deletePaymentMethod);
router.get("/tab/:tab", deposite_controller_1.getPaymentMethodByTab);
// Public (Frontend)
router.get("/", deposite_controller_1.getActivePaymentMethods);
router.post("/instruction", deposite_controller_1.createInstruction);
router.get("/instruction/get", deposite_controller_1.getAllInstructions);
router.get("/instruction/tab/:tab", deposite_controller_1.getInstructionsByType);
router.put("/instruction/:id", deposite_controller_1.updateInstruction);
router.delete("/instruction/:id", deposite_controller_1.deleteInstruction);
// Admin routes
router.post("/tittle", deposite_controller_1.createTittle);
router.get("/tittle", deposite_controller_1.getAllTittles);
router.patch("/tittle/:id", deposite_controller_1.updateTittle);
router.delete("/tittle/:id", deposite_controller_1.deleteTittle);
// Frontend
router.get("/active/:tab", deposite_controller_1.getActiveTittlesByTab);
router.get("/tittle/:id", deposite_controller_1.getSingleTittle);
exports.depositRouter = router;
