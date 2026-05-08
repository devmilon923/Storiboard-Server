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
router
  .route("/follow/:userId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    UserController.followUser,
  );
export const UserRouter = router;
