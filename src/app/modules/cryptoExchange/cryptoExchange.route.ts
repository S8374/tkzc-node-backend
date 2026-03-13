import { Router } from "express";
import * as ExchangeController from "./cryptoExchange.controller";

const router = Router();

router.post("/", ExchangeController.createExchange);

router.get("/", ExchangeController.getAllExchanges);

router.get("/active", ExchangeController.getActiveExchanges);

router.patch("/:id", ExchangeController.updateExchange);

router.delete("/:id", ExchangeController.deleteExchange);

export const CryptoExchangeRoutes = router;