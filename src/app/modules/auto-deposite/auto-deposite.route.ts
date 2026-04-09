import { Router } from "express";
import { AutoDepositControllers } from "./auto-deposite.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// Callback from OraclePay or frontend
router.post("/callback", AutoDepositControllers.handleCallback);

// Admin route
router.get(
  "/admin/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AutoDepositControllers.getAllAutoDeposits
);

export const AutoDepositRoutes = router;
