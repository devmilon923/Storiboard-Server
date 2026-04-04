
import { ErrorRequestHandler } from "express";


const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let errorInfo = {
    success: false,
    statusCode: 500,
    errorType: "Invalid request",
    errorMessage: "",
    errorDetails: { path: null, value: null },
  };

  return res.status(errorInfo.statusCode).json({
    success: errorInfo.success,
    path: req.originalUrl,
    status: errorInfo.statusCode,
    errorType: errorInfo.errorType,
    message: errorInfo.errorMessage,

  });
};

export default globalErrorHandler;