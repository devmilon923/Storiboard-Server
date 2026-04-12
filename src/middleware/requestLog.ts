import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const getStatusCodeColor = (statusCode: number): string => {
  if (statusCode >= 500) return `\x1b[31m${statusCode}\x1b[0m`; // Red
  if (statusCode >= 400) return `\x1b[33m${statusCode}\x1b[0m`; // Yellow
  if (statusCode >= 300) return `\x1b[36m${statusCode}\x1b[0m`; // Cyan
  if (statusCode >= 200) return `\x1b[32m${statusCode}\x1b[0m`; // Green
  return `${statusCode}`;
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const contentLength = req.get("content-length") || "0";
    const coloredStatusCode = getStatusCodeColor(res.statusCode);

    logger.info(
      `${req.method} ${req.path} - ${coloredStatusCode} - ${duration}ms - ${contentLength} bytes`,
    );
  });

  next();
};
