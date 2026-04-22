import { Request, Response } from "express";
import httpStatus from "http-status";
import { handleAsync } from "../../utils/handleAsync";
import sendResponse from "../../utils/response";
import { TJwtUser } from "../../utils/jwtValidation";
import { prisma } from "../../utils/prisma";

const createPost = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as TJwtUser;
  const result = await prisma.post.create({
    data: {
      ...req.body,
      author: { connect: { id: user.id } },
    },
  });
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create post successfully!",
    data: result,
  });
});

const updatePost = handleAsync(async (req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update post successfully!",
    data: true,
  });
});
const getPost = handleAsync(async (req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get post successfully!",
    data: true,
  });
});
const getPosts = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as TJwtUser;
  const result = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all post successfully!",
    data: result,
  });
});
const deletePost = handleAsync(async (req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete post successfully!",
    data: true,
  });
});
export const PostController = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  getPosts,
};
