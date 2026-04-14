"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const wallet_controller_1 = require("../wallet/wallet.controller");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.UserControllers.createUser);
router.get("/wallet", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getWallet);
router.get("/stats", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getUserStats);
router.patch("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.updateCurrentUser);
router.patch("/password", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.changeLoginPassword);
router.patch("/wallet/update", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), wallet_controller_1.WalletControllers.updateWallet);
// /api/v1/user/:id
exports.UserRoutes = router;
