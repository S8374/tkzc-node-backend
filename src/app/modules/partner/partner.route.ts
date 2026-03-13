import { Router } from "express";
import * as PartnerController from "./partner.controller";

const router = Router();

router.post("/", PartnerController.createPartner);

router.get("/", PartnerController.getAllPartners);

router.get("/active", PartnerController.getActivePartners);

router.patch("/:id", PartnerController.updatePartner);

router.delete("/:id", PartnerController.deletePartner);

export const PartnerRoutes = router;