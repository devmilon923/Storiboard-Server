import { Job, Worker } from "bullmq";
import { prisma } from "../../utils/prisma";

const W_likeHandler = async (job: Job<any, any, string>) => {
  console.log("W_likeHandler get a job", job.data);
  let basedFormula = {
    likes: 1,
    comments: 2,
    recency: 0.3,
  };

  try {
    if (job.data.isLiked) {
      await prisma.post.update({
        where: {
          id: job.data.postId,
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
          id: job.data.postId,
        },
        data: {
          trendScore: {
            decrement: basedFormula.likes,
          },
        },
      });
    }
  } catch (error) {}
};

export { W_likeHandler };
