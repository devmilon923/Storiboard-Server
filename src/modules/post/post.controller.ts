import { Request, Response } from "express";
import httpStatus from "http-status";
import { handleAsync } from "../../utils/handleAsync";
import sendResponse from "../../utils/response";
import { TJwtUser } from "../../utils/jwtValidation";
import { prisma } from "../../utils/prisma";
import ServerError from "../../utils/error";

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
  const pc = Number(req.query.pc as string);
  const limit = Number(req.query.limit as string);
  const result = await prisma.post.findMany({
    take: limit || 10,
    skip: pc ? 1 : 0,
    cursor: pc ? { id: pc } : undefined,
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
    orderBy: { id: "desc" },
  });

  const cursor = result.length < limit ? result[result.length - 1].id : null;
  const postIds = result.map((data) => data.id);
  const latestComments = await prisma.comment.findMany({
    where: {
      sourceId: { in: postIds },
      commentType: "post",
    },
    orderBy: { sourceId: "desc" },
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
    cursor: cursor || null,
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

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment added successfully!",
    data: result,
  });
  if (commentType === "post") {
    await prisma.post.update({
      where: {
        id: sourceId,
      },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    });
  } else if (commentType === "replie") {
    await prisma.comment.update({
      where: {
        id: sourceId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  }
});
const getComments = handleAsync(async (req: Request, res: Response) => {
  const user = req.user as TJwtUser;
  const { sourceId, commentType } = req.query;
  const pc = Number(req.query.pc as string) || null;
  const limit = Number(req.query.limit as string) || 10;
  if (!sourceId) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Source id is required");
  }
  if (!commentType) {
    throw new ServerError(httpStatus.BAD_REQUEST, "Comment type is required");
  }
  if (commentType !== "post" && commentType !== "replie") {
    throw new ServerError(
      httpStatus.BAD_REQUEST,
      "Comment type is not valid (post/replie)",
    );
  }
  const result = await prisma.comment.findMany({
    take: limit,
    skip: pc ? 1 : 0,
    cursor: pc ? { id: pc } : undefined,
    where: {
      sourceId: +sourceId,
      commentType,
    },
    orderBy: { id: "desc" },
    select: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      createdAt: true,
      content: true,
      id: true,
      likesCount: true,
      commentCount: true,
    },
  });
  const cursor = result.length < limit ? result[result.length - 1].id : null;
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments get successfully!",
    data: result,
    cursor,
  });
});
export const PostController = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  getPosts,
  addComment,
  getComments,
};
