"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.get("/", admin_controller_1.AdminControllers.getAllUsers);
router.get("/:id", admin_controller_1.AdminControllers.getSingleUser);
router.patch("/:id/status", admin_controller_1.AdminControllers.changeUserStatus);
router.patch("/:id/role", admin_controller_1.AdminControllers.changeUserRole);
router.delete("/:id", admin_controller_1.AdminControllers.deleteUser);
router.patch("/:id", admin_controller_1.AdminControllers.updateUser); // Add this route
exports.AdminRoutes = router;
