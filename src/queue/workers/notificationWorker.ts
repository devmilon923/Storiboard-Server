import { Job, Worker } from "bullmq";
import { NotificationType, sendNotification } from "../../utils/notifications";
import redisDatabase from "../../utils/redisConnection";
import { prisma } from "../../utils/prisma";
import { notificationType } from "../../generated/prisma/enums";

const W_SendNotification = async (
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
      ? "like on post"
      : job.data.likeType === "comment"
        ? "like on comment"
        : "like on reply";
  let receiverId = null;
  console.log(job.data);
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

new Worker("handleNotification", W_SendNotification, {
  connection: redisDatabase,
});
export { W_SendNotification };
