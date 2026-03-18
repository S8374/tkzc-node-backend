import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.get("/me",     checkAuth(...Object.values(Role)),AuthControllers.getMe); 
router.post("/logout", checkAuth(...Object.values(Role)), AuthControllers.logout)

export const AuthRoutes = router;