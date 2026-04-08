import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import "./utils/redisConnection";
import "./strategy/jwt-strategy";
import { requestLogger } from "./middleware/requestLog";
import mainrouter from "./modules/routes";
import globalErrorHandler from "./middleware/errorHandler";
import passport from "passport";
const app: Express = express();
const port = process.env.ServerPort || 3000;
app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express with TypeScript!" });
});
app.use(mainrouter);
app.use(globalErrorHandler);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
