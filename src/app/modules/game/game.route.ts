import { Router } from "express";
import { GameController } from "./game.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();
router.post("/", GameController.handleCallback);
router.post("/callback", GameController.handleCallback);
router.get("/my-bets", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), GameController.getUserBets);

export const GameRoutes = router;
