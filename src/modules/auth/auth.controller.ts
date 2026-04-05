import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import sendResponse from "../../utils/response";
import httpStatus from "http-status";
import ServerError from "../../utils/error";
const register = handleAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      email: "elsa@prisma.io",
      name: "Elsa Prisma",
    },
  });
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Requst send successfully!",
    data: user,
  });
});

const localLogin = handleAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: "elsa1@prisma.io",
    },
  });
  if (!user) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid login details");
  }
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Login successfully!",
    data: user,
  });
});
export const AuthController = {
  register,
  localLogin,
};
