import ServerError from "../../utils/error";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { loginToken } from "../../utils/jwtValidation";
import sendResponse from "../../utils/response";
const getProfile = handleAsync(async (req: Request, res: Response) => {
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email: req.body.email,
  //     },
  //     omit: {
  //       password: false,
  //     },
  //   });
  //   if (!user) {
  //     throw new ServerError(httpStatus.BAD_REQUEST, "Invalid login details");
  //   }
  //   const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
  //   if (!isValidPassword) {
  //     throw new ServerError(httpStatus.BAD_REQUEST, "Invalid password");
  //   }
  //   const token = loginToken(user);
  //   // generate refresh token
  //   const refreshToken = bcrypt.hashSync(token, 20);
  //   res.cookie("rt", refreshToken, {
  //     maxAge: 1000 * 60 * 60 * 24, // expires in 24 hours (milliseconds)
  //     httpOnly: true, // inaccessible to client-side JavaScript
  //     secure: true, // only sent over HTTPS
  //     sameSite: "strict", // CSRF protection
  //     // domain: "example.com", // cookie domain
  //   });
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Profile get successfully!",
    data: req.user,
  });
});
export const UserController = { getProfile };
