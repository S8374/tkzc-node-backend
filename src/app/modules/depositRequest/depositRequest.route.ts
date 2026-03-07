import { Router } from "express";
import { DepositRequestController } from "./depositRequest.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// User routes
router.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.createDepositRequest
);

router.get(
  "/my-requests",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.getUserDepositRequests
);

// Admin routes
router.get(
  "/admin/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.getAllDepositRequests
);

router.get(
  "/admin/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.getSingleDepositRequest
);

router.patch(
  "/admin/:id/approve",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.approveDepositRequest
);

router.patch(
  "/admin/:id/reject",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.rejectDepositRequest
);

router.delete(
  "/admin/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DepositRequestController.deleteDepositRequest
);

export const DepositRequestRoutes = router;