import { Router } from "express";
import passport from "passport";
import { NotificationController } from "./notification.controller";

const router = Router();
router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    NotificationController.getAllNotifications,
  );

export const NotificationRouter = router;
