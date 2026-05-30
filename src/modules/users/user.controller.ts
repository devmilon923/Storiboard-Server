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
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.clearCookie("verification_token");
    throw new ServerError(httpStatus.BAD_REQUEST, "No user found");
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
  if (user.id === Number(followedUserId)) {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "You can not follow yourself",
    );
  }
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

const getFollowers = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as TJwtUser;
  const pc = parseInt(req.query.pc as string) || null;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchQ = (req.query.searchQ as string) || null;
  const filterBy =
    (req.query.profession as string) === "All"
      ? null
      : (req.query.profession as string);
  let query: any = {
    followingId: user.id,
  };
  if (searchQ?.trim()) {
    query.follower = {
      OR: [
        { name: { contains: searchQ.trim(), mode: "insensitive" } },
        // { email: { contains: searchQ.trim(), mode: "insensitive" } },
      ],
    };
  }
  if (filterBy?.trim()) {
    query.follower = {
      OR: [{ profession: { contains: filterBy.trim(), mode: "insensitive" } }],
    };
  }
  const result = await prisma.follower.findMany({
    take: limit,
    skip: pc ? 1 : 0,
    cursor: pc ? { id: pc } : undefined,
    where: query,
    select: {
      id: true,
      follower: {
        select: {
          name: true,
          _count: {
            select: {
              followers: true,
            },
          },
          profession: true,
          email: true,
          id: true,
          image: true,
        },
      },
    },
    orderBy: [{ id: "desc" }],
  });
  const cursor = result.length === limit ? result[result.length - 1] : null;
  const response = result.map((fdata) => {
    return {
      followerId: fdata.follower.id,
      name: fdata.follower.name,
      email: fdata.follower.email,
      image: fdata.follower.image,
      profession: fdata.follower.profession,
      followersCount: fdata.follower._count.followers || 0,
      isFollowing: true,
      isVerifyed: true,
    };
  });
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Followers get successfully!",
    data: response,
    cursor,
  });
});
export const UserController = { getProfile, followUser, getFollowers };
