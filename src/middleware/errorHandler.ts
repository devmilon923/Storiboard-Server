import { ErrorRequestHandler } from "express";
import ServerError from "../utils/error";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let errorInfo = {
    success: false,
    statusCode: 500,
    errorType: "Invalid request",
    errorMessage: "",
  };
  if (error instanceof ServerError) {
    errorInfo.statusCode = error.statusCode;
    errorInfo.errorMessage = error.message;
  }
  return res.status(errorInfo.statusCode).json({
    success: errorInfo.success,
    path: req.originalUrl,
    status: errorInfo.statusCode,
    errorType: errorInfo.errorType,
    message: errorInfo.errorMessage,
  });
};

export default globalErrorHandler;
