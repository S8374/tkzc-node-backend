import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { WalletControllers } from "../wallet/wallet.controller";

const router = Router()



router.post("/register", UserControllers.createUser);
router.get("/wallet", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getWallet);
router.get("/stats", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getUserStats);
router.patch("/me", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.updateCurrentUser);
router.patch("/password", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), UserControllers.changeLoginPassword);
router.patch("/wallet/update", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WalletControllers.updateWallet);

// /api/v1/user/:id
export const UserRoutes = router