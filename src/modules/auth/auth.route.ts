import { Router } from "express";
import { AuthController } from "./auth.controller";
import { zodValidate } from "../../middleware/validation";
import { loginValidation } from "./validation";

const router = Router();

router
  .route("/login")
  .post(zodValidate(loginValidation), AuthController.localLogin);
router.route("/register").post(AuthController.register);
export const AuthRoutes = router;
