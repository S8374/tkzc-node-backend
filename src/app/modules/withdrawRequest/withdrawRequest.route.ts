import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WithdrawRequestController } from "./withdrawRequest.controller";

const router = Router();

// User routes
router.get(
  "/eligibility",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.getWithdrawEligibility
);

router.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.createWithdrawRequest
);

router.get(
  "/my-requests",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.getUserWithdrawRequests
);

router.patch(
  "/:id/cancel",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.cancelWithdrawRequest
);

// Admin routes
router.get(
  "/admin/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.getAllWithdrawRequests
);

router.get(
  "/admin/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.getSingleWithdrawRequest
);

router.patch(
  "/admin/:id/approve",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.approveWithdrawRequest
);

router.patch(
  "/admin/:id/reject",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  WithdrawRequestController.rejectWithdrawRequest
);

export const WithdrawRequestRoutes = router;
