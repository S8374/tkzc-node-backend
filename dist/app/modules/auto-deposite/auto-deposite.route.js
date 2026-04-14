"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDepositRoutes = void 0;
const express_1 = require("express");
const auto_deposite_controller_1 = require("./auto-deposite.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// Callback from OraclePay or frontend
router.post("/callback", auto_deposite_controller_1.AutoDepositControllers.handleCallback);
// Admin route
router.get("/admin/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), auto_deposite_controller_1.AutoDepositControllers.getAllAutoDeposits);
exports.AutoDepositRoutes = router;
