import { Router } from "express";
import { createInstruction, createPaymentMethod, createTittle, deleteInstruction, deletePaymentMethod, deleteTittle, getActivePaymentMethods, getActiveTittlesByTab, getAllInstructions, getAllPaymentMethods, getAllTittles, getInstructionsByType, getPaymentMethodByTab, getSingleTittle, updateInstruction, updatePaymentMethod, updateTittle } from "./deposite.controller";

const router = Router();

// Admin
router.post("/", createPaymentMethod);
router.get("/all", getAllPaymentMethods);
router.put("/:id", updatePaymentMethod);
router.delete("/:id", deletePaymentMethod);
router.get("/tab/:tab", getPaymentMethodByTab);

// Public (Frontend)
router.get("/", getActivePaymentMethods);




router.post("/instruction", createInstruction);
router.get("/instruction/get", getAllInstructions);
router.get("/instruction/tab/:tab", getInstructionsByType);
router.put("/instruction/:id", updateInstruction);
router.delete("/instruction/:id", deleteInstruction);



// Admin routes
router.post("/tittle", createTittle);
router.get("/tittle", getAllTittles);
router.patch("/tittle/:id", updateTittle);
router.delete("/tittle/:id", deleteTittle);

// Frontend
router.get("/active/:tab", getActiveTittlesByTab);
router.get("/tittle/:id", getSingleTittle);

export const depositRouter =  router;