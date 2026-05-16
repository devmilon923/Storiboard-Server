import { Queue, Worker } from "bullmq";
import redisDatabase from "../../utils/redisConnection";

import { W_CommentHandler } from "../workers/postWorker";
import {
  W_SendCommentNotification,
  W_SendLikeNotification,
} from "../workers/notificationWorker";

const handleSendNotification = new Queue("handleSendNotification", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});

async function like(params: {
  sourceId: number;
  likeType: "post" | "replie" | "comment";
  sender: {
    name: string;
    id: number;
  };
}) {
  try {
    console.log("notification like producers running");
    await handleSendNotification.add("sendLikeNotification", params);
    console.log("Notification added on queue");
  } catch (error) {
    throw error;
  }
}
async function comment(params: {
  sourceId: number;
  commentType: "post" | "replie";
  sender: {
    name: string;
    id: number;
  };
}) {
  try {
    console.log("notification comment producers running");
    await handleSendNotification.add("sendCommentNotification", params);
    console.log("Notification added on queue");
  } catch (error) {
    throw error;
  }
}
new Worker("handleSendNotification", W_SendLikeNotification, {
  connection: redisDatabase,
});
new Worker("handleSendNotification", W_SendCommentNotification, {
  connection: redisDatabase,
});
export const NotificationQueue = {
  like,
  comment,
};
