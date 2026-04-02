import { Router } from "express";

const router = Router();

router.route("/login").post(() => {});
router.route("/register").post(() => {});
export const AuthRoutes = router;
