interface ServerError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorDetails?: { path?: string | null; value?: any };
}

class ServerError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(`${message}`);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.defineProperty(this, "stack", { value: undefined });
  }
}

export default ServerError;
