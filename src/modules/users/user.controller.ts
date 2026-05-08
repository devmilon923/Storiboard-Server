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
const followUser = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as TJwtUser;
  const followedUserId = req.params.userId;
  let isFollowing = false;
  try {
    await prisma.follower.create({
      data: {
        follower: { connect: { id: user.id } },
        following: { connect: { id: Number(followedUserId) } },
      },
    });
    isFollowing = true;
  } catch (error: any) {
    if (error.code === "P2002") {
      await prisma.follower.delete({
        where: {
          uniqueFollower: {
            followerId: user.id,
            followingId: Number(followedUserId),
          },
        },
      });
    } else {
      throw error;
    }
  }
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow update successfully!",
    data: isFollowing,
  });
});
export const UserController = { getProfile, followUser };
