import { Router } from "express";
import { AuthController } from "./auth.controller";
import { zodValidate } from "../../middleware/validation";
import {

  loginValidation,
  registrationValidation,
  verifyAccount,
} from "./validation";

const router = Router();

router
  .route("/login")
  .post(zodValidate(loginValidation), AuthController.localLogin);
router
  .route("/register")
  .post(zodValidate(registrationValidation), AuthController.register);

router
  .route("/verify-account")
  .patch(zodValidate(verifyAccount), AuthController.verifyAccount);

router.route("/resend-otp").post(AuthController.resendOTP);
export const AuthRoutes = router;
