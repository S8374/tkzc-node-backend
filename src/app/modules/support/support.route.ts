import { Router } from "express";
import * as SupportController from "./support.controller";

const router = Router();

router.post("/", SupportController.createSupport);

router.get("/", SupportController.getAllSupports);

router.get("/active", SupportController.getActiveSupports);

router.patch("/:id", SupportController.updateSupport);

router.delete("/:id", SupportController.deleteSupport);

export const SupportRoutes = router;