import { Router } from "express";
import * as PromotionController from "./promotion.controller";

const router = Router();

router.post("/", PromotionController.createPromotion);

router.get("/", PromotionController.getAllPromotions);

router.get("/tab/:tab", PromotionController.getPromotionsByTab);

router.patch("/:id", PromotionController.updatePromotion);

router.delete("/:id", PromotionController.deletePromotion);

export const PromotionRoutes = router;