import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
import { UserRouter } from "./users/user.route";
import { PostRouter } from "./post/post.route";
import { NotificationRouter } from "./notifications/notification.route";
const router = Router();

// config all root and handler
export const appRouters = [
  {
    path: "/auth",
    handler: AuthRoutes,
  },
  {
    path: "/user",
    handler: UserRouter,
  },

  {
    path: "/post",
    handler: PostRouter,
  },
  {
    path: "/notification",
    handler: NotificationRouter,
  },
];

// ready for use
appRouters.forEach(({ path, handler }) => {
  router.use(path, handler);
});

export default router;
