"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawRequestRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const withdrawRequest_controller_1 = require("./withdrawRequest.controller");
const router = (0, express_1.Router)();
// User routes
router.get("/eligibility", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.getWithdrawEligibility);
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.createWithdrawRequest);
router.get("/my-requests", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.getUserWithdrawRequests);
router.patch("/:id/cancel", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.cancelWithdrawRequest);
// Admin routes
router.get("/admin/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.getAllWithdrawRequests);
router.get("/admin/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.getSingleWithdrawRequest);
router.patch("/admin/:id/approve", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.approveWithdrawRequest);
router.patch("/admin/:id/reject", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), withdrawRequest_controller_1.WithdrawRequestController.rejectWithdrawRequest);
exports.WithdrawRequestRoutes = router;
