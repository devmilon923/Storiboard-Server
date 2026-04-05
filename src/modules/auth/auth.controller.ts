import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import sendResponse from "../../utils/response";
import httpStatus from "http-status";
import ServerError from "../../utils/error";
import bcrypt from "bcrypt";
const register = handleAsync(async (req: Request, res: Response) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hashPassword as string,
    },
  });
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Register successfully!",
    data: user,
  });
});

const localLogin = handleAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
    omit: {
      password: false,
    },
  });
  if (!user) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid login details");
  }
  const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!isValidPassword) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid password");
  }
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Login successfully!",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerifyed: user.isVerifyed,
    },
  });
});
export const AuthController = {
  register,
  localLogin,
};
