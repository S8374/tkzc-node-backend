"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositRequestRoutes = void 0;
const express_1 = require("express");
const depositRequest_controller_1 = require("./depositRequest.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
// User routes
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.createDepositRequest);
router.get("/my-requests", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.getUserDepositRequests);
// Admin routes
router.get("/admin/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.getAllDepositRequests);
router.get("/admin/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.getSingleDepositRequest);
router.patch("/admin/:id/approve", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.approveDepositRequest);
router.patch("/admin/:id/reject", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.rejectDepositRequest);
router.delete("/admin/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.deleteDepositRequest);
exports.DepositRequestRoutes = router;
