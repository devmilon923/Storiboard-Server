import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { prisma } from "../../utils/prisma";
import sendResponse from "../../utils/response";
import httpStatus from "http-status";
import ServerError from "../../utils/error";
import bcrypt from "bcrypt";
import redisDatabase from "../../utils/redisConnection";

import {
  decodeToken,
  loginToken,
  verificationToken,
} from "../../utils/jwtValidation";
import { generateOTP, verifyOTP } from "../../utils/otpValidation";

const register = handleAsync(async (req: Request, res: Response) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hashPassword as string,
    },
  });

  const time = await redisDatabase.ttl("otp" + user.id.toString());
  if (time && time !== -2) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Try again after" + time + "seconds",
    );
  }

  // Expire in 60 seconds
  const secureOTP: any = generateOTP();

  await redisDatabase.setex("otp" + user.id.toString(), 120, secureOTP.hash);

  //TODO: need to add email send otp

  //TODO: Need to generate an validation otp
  const token = verificationToken(user.id.toString(), "accountVerification");
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Register successfully but you need to verify your account",
    data: { user, token },
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
  const token = loginToken(user);
  // generate refresh token
  const refreshToken = bcrypt.hashSync(token, 20);
  res.cookie("rt", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24, // expires in 24 hours (milliseconds)
    httpOnly: true, // inaccessible to client-side JavaScript
    secure: true, // only sent over HTTPS
    sameSite: "strict", // CSRF protection
    // domain: "example.com", // cookie domain
  });
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Login successfully!",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerifyed: user.isVerifyed,
      token,
    },
  });
});

const verifyAccount = handleAsync(async (req: Request, res: Response) => {
  const authHeader = req.get("Authorization")?.split(" ")[1];
  if (!authHeader) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Authorization token is required",
    );
  }
  const payload: any = decodeToken(authHeader);
  if (payload.type !== "accountVerification") {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid action");
  }
  const redisSecureOtp = await redisDatabase.get(
    "otp" + payload.user.toString(),
  );
  if (!redisSecureOtp) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Invalid OTP. Please send again new otp",
    );
  }
  const userOtp = req.body.otp;

  const verifyOTPHash = verifyOTP(redisSecureOtp, userOtp);

  if (!verifyOTPHash) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Invalid OTP. Please send again new otp",
    );
  }
  const user = await prisma.user.update({
    where: {
      id: parseInt(payload.user),
    },
    data: {
      isVerifyed: true,
    },
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Account verifyed successfully!",
    data: user,
  });
  await redisDatabase.del("otp" + payload.user.toString());
});

const resendOTP = handleAsync(async (req: Request, res: Response) => {
  const authHeader = req.get("Authorization")?.split(" ")[1];
  if (!authHeader) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Authorization token is required",
    );
  }
  const payload: any = decodeToken(authHeader);
  if (
    payload.type !== "accountVerification" &&
    payload.type !== "forgetPassword"
  ) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid action");
  }
  const time = await redisDatabase.ttl("otp" + payload.user.toString());
  if (time && time !== -2) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Try again after" + " " + time + " " + "seconds",
    );
  }
  console.log(payload);
  // Expire in 60 seconds
  const secureOTP: any = generateOTP();
  console.log(secureOTP);
  await redisDatabase.setex(
    "otp" + payload.user.toString(),
    120,
    secureOTP.hash,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New OTP sended!",
    data: authHeader,
  });
});
const forgetPassword = handleAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Please provide valid information",
    );
  }
  const token = verificationToken(user.id?.toString(), "forgetPassword");
  const secureOTP = generateOTP();
  await redisDatabase.setex("otp" + user.id.toString(), 120, secureOTP.hash);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Forget OTP sended!",
    data: token,
  });
});
const newPassword = handleAsync(async (req: Request, res: Response) => {
  const authHeader = req.get("Authorization")?.split(" ")[1];
  if (!authHeader) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Authorization token is required",
    );
  }
  const payload: any = decodeToken(authHeader);
  if (payload.type !== "forgetPassword") {
    throw new ServerError(httpStatus.BAD_REQUEST, "Invalid action");
  }
  const redisSecureOtp = await redisDatabase.get(
    "otp" + payload?.user?.toString(),
  );
  if (!redisSecureOtp) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Invalid OTP. Please send again new otp",
    );
  }
  const userOtp = req.body.otp;

  const verifyOTPHash = verifyOTP(redisSecureOtp, userOtp);

  if (!verifyOTPHash) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Invalid OTP. Please send again new otp",
    );
  }
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const user = await prisma.user.update({
    where: {
      id: parseInt(payload.user),
    },
    data: {
      password: hashPassword,
    },
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Password recovery successful",
    data: user,
  });
  await redisDatabase.del("otp" + payload.user.toString());
});
export const AuthController = {
  register,
  localLogin,
  verifyAccount,
  resendOTP,
  forgetPassword,
  newPassword,
};
