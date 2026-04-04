import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { error } from "node:console";

const register = handleAsync(async (req: Request, res: Response) => {
  res.send({ status: "success" });
});
export const AuthController = {
  register,
};
