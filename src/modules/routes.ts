import { Router } from "express";
import { AuthRoutes } from "./auth/auth.route";
const mainrouter = Router();

// config all root and handler
export const appRouters = [
  {
    path: "/auth",
    handler: AuthRoutes,
  },
];

// ready for use
appRouters.forEach(({ path, handler }) => {
  mainrouter.use(path, handler);
});

export default mainrouter;
