import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const contentLength = req.get("content-length") || "0";

    logger.info(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${contentLength} bytes`,
    );
  });

  next();
};
