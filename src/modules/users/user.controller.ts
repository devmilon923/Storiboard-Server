import ServerError from "../../utils/error";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/response";
import { TJwtUser } from "../../utils/jwtValidation";
const getProfile = handleAsync(async (req: Request, res: Response) => {
  const data = req.user as TJwtUser;

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
