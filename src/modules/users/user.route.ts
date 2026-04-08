import { Router } from "express";
import passport from "passport";
import { UserController } from "./user.controller";

const router = Router();

router
  .route("/profile")
  .get(
    passport.authenticate("jwt", { session: false }),
    UserController.getProfile,
  );
export const UserRouter = router;
