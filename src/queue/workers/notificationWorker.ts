import { Job, Worker } from "bullmq";
import { NotificationType, sendNotification } from "../../utils/notifications";
import redisDatabase from "../../utils/redisConnection";
import { prisma } from "../../utils/prisma";
import { notificationType } from "../../generated/prisma/enums";

const W_SendLikeNotification = async (
  job: Job<
    {
      sourceId: number;
      likeType: "post" | "replie" | "comment";
      sender: {
        name: string;
        id: number;
      };
    },
    any,
    string
  >,
) => {
  let title =
    job.data.likeType === "post"
      ? "Like on your post"
      : job.data.likeType === "comment"
        ? "Like on your comment"
        : "Like on your reply";
  let receiverId = null;
  try {
    if (job.data.likeType === "post" || job.data.likeType === "comment") {
      let findAuthor = await prisma.post.findUnique({
        where: { id: job.data.sourceId },
        select: {
          authorId: true,
        },
      });
      receiverId = findAuthor?.authorId;
    } else if (job.data.likeType === "replie") {
      let findComment = await prisma.comment.findUnique({
        where: { id: job.data.sourceId },
        select: { id: true },
      });
      let findAuthor = await prisma.post.findUnique({
        where: { id: findComment?.id },
        select: {
          authorId: true,
        },
      });
      receiverId = findAuthor?.authorId;
    }
  } catch (error) {
    throw error;
  }
  console.log(receiverId);

  if (receiverId) {
    await sendNotification({
      title,
      content: `${job.data.sender.name || "Unknown"} liked your ${job.data.likeType}`,
      notiType:
        `LIKE_ON_${job.data.likeType.toUpperCase()}` as notificationType,
      senderId: job.data.sender.id,
      receiverId,
    });
  }
};
const W_SendCommentNotification = async (
  job: Job<
    {
      sourceId: number;
      commentType: "post" | "replie";
      sender: {
        name: string;
        id: number;
      };
    },
    any,
    string
  >,
) => {
  let title =
    job.data.commentType === "post"
      ? "Comment on your post"
      : "Comment on your reply";
  let receiverId = null;

  try {
    if (job.data.commentType === "post") {
      let findAuthor = await prisma.post.findUnique({
        where: { id: job.data.sourceId },
        select: {
          authorId: true,
        },
      });
      receiverId = findAuthor?.authorId;
    } else if (job.data.commentType === "replie") {
      let findComment = await prisma.comment.findUnique({
        where: { id: job.data.sourceId },
        select: { id: true },
      });
      let findAuthor = await prisma.post.findUnique({
        where: { id: findComment?.id },
        select: {
          authorId: true,
        },
      });
      receiverId = findAuthor?.authorId;
    }
  } catch (error) {
    throw error;
  }
  console.log(receiverId);

  if (receiverId) {
    await sendNotification({
      title,
      content: `${job.data.sender.name || "Unknown"} commented on your ${job.data.commentType}`,
      notiType:
        `COMMENT_ON_${job.data.commentType.toUpperCase()}` as notificationType,
      senderId: job.data.sender.id,
      receiverId,
    });
  }
};

export { W_SendLikeNotification, W_SendCommentNotification };
