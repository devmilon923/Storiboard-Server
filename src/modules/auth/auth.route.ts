import { Router } from "express";
import { AuthController } from "./auth.controller";
import { zodValidate } from "../../middleware/validation";
import {
  forgetPassword,
  loginValidation,
  newPassword,
  registrationValidation,
  renewToken,
  verifyAccount,
} from "./validation";
import passport from "passport";

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

router
  .route("/new-password")
  .patch(zodValidate(newPassword), AuthController.newPassword);

router.route("/resend-otp").post(AuthController.resendOTP);

router
  .route("/forget-password")
  .post(zodValidate(forgetPassword), AuthController.forgetPassword);

router
  .route("/renew-token")
  .post(
    passport.authenticate("jwt", { session: false }),
    zodValidate(renewToken),
    AuthController.renewToken,
  );
export const AuthRoutes = router;
