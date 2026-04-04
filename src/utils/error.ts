interface ServerError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorDetails?: { path?: string | null; value?: any };
}

export default function ServerError(
  statusCode: number,
  message: string,
  errorDetails?: { path?: string | null; value?: any },
  isOperational = true,
): ServerError {
  const error = new Error(`${message}`) as ServerError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  error.errorDetails = errorDetails || { path: null, value: null };

  Object.defineProperty(error, "stack", { value: undefined });

  return error;
}

function isApiError(error: unknown): error is ServerError {
  return (
    error instanceof Error &&
    typeof (error as any).statusCode === "number" &&
    typeof (error as any).isOperational === "boolean"
  );
}
