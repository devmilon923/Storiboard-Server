import { Job, Worker } from "bullmq";
import { prisma } from "../../utils/prisma";
import { TCommentState, TLikeState } from "../../modules/post/post.controller";
let basedFormula = {
  likes: 1,
  comments: 2,
};
const W_LikeHandler = async (job: Job<any, any, string>) => {
  console.log("W_likeHandler get a job", job.data);
  const data = job.data as TLikeState;
  try {
    if (data.isLiked) {
      await prisma.post.update({
        where: {
          id: data.postId as number,
        },
        data: {
          trendScore: {
            increment: basedFormula.likes,
          },
        },
      });
    } else {
      await prisma.post.update({
        where: {
          id: data.postId as number,
        },
        data: {
          trendScore: {
            decrement: basedFormula.likes,
          },
        },
      });
    }
  } catch (error) {
    throw error;
  }
};
const W_CommentHandler = async (job: Job<any, any, string>) => {
  console.log("W_CommentHandler get a job", job.data);
  const data = job.data as TCommentState;
  try {
    if (data.isComment) {
      await prisma.post.update({
        where: {
          id: data.postId as number,
        },
        data: {
          trendScore: {
            increment: basedFormula.comments,
          },
        },
      });
    } else {
      await prisma.post.update({
        where: {
          id: data.postId as number,
        },
        data: {
          trendScore: {
            decrement: basedFormula.comments,
          },
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

export { W_LikeHandler, W_CommentHandler };
