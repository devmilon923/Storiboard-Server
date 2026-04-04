import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import ServerError from "../../utils/error";

const register = handleAsync(async (req: Request, res: Response) => {
  throw new ServerError(400, "errorf");
});
export const AuthController = {
  register,
};
