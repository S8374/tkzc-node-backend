import { Router } from "express";
import { GameController } from "./game.controller";

const router = Router();
router.post("/", GameController.handleCallback);
router.post("/callback", GameController.handleCallback);

export const GameRoutes = router;
