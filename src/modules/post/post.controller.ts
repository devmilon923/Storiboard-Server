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
    select: {
      author: {
        select: {
          name: true,
          image: true,
          isVerifyed: true,
          profession: true,
        },
      },
      content: true,
      createdAt: true,
      id: true,
      likesCount: true,
      commentsCount: true,
      feeling: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const postIds = result.map((data) => data.id);

  const latestComments = await prisma.comment.findMany({
    where: {
      sourceId: { in: postIds },
      commentType: "post",
    },
    orderBy: [{ sourceId: "asc" }, { createdAt: "desc" }],
    distinct: ["sourceId"],
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const commentsMap = new Map(latestComments.map((c) => [c.sourceId, c]));

  const response = result.map((data) => ({
    ...data,
    comments: commentsMap.has(data.id) ? [commentsMap.get(data.id)] : [],
  }));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all post successfully!",
    data: response,
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

const addComment = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as TJwtUser;
  const { content, sourceId, commentType } = req.body;
  const result = await prisma.comment.create({
    data: {
      content,
      sourceId,
      commentType,
      user: { connect: { id: user.id } },
    },
  });

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment added successfully!",
    data: result,
  });
});
export const PostController = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  getPosts,
  addComment,
};
