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
router
  .route("/followers")
  .get(
    passport.authenticate("jwt", { session: false }),
    UserController.getFollowers,
  );
export const UserRouter = router;
