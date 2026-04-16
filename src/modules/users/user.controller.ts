import ServerError from "../../utils/error";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/response";
const getProfile = handleAsync(async (req: Request, res: Response) => {
  const data: any = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    omit: {
      password: false,
    },
  });
  if (!user) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid login details");
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile get successfully!",
    data: { ...user, role: "user" },
  });
});
export const UserController = { getProfile };
