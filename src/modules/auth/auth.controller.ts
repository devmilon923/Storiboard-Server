import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import sendResponse from "../../utils/response";
import httpStatus from "http-status";
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
export const AuthController = {
  register,
};
