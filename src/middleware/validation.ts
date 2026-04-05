import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const zodValidate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // safeParse or parse can be used; parse throws an error on failure
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: false,
          message: "Zod validation error",
          errors: error.issues.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  };
