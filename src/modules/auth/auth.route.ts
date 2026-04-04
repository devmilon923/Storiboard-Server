import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.route("/login").post(() => {});
router.route("/register").post(AuthController.register);
export const AuthRoutes = router;
