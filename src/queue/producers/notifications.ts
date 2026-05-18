import { Queue, Worker } from "bullmq";
import redisDatabase from "../../utils/redisConnection";

import {
  W_CreateNotificationSetting,
  W_SendCommentNotification,
  W_SendLikeNotification,
} from "../workers/notificationWorker";

const handleSendNotification = new Queue("handleSendNotification", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
const handleSendCommentNotification = new Queue("handleSendCommentNotification", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
const handleSendLikeNotification = new Queue("handleSendLikeNotification", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
const handleNotificationSetting = new Queue("handleNotificationSetting", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
async function createSetting(userId: number) {
  try {
    await handleNotificationSetting.add("createSetting", userId);
    console.log("Notification setting added on queue");
  } catch (error) {
    throw error;
  }
}
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
    await handleSendLikeNotification.add("sendLikeNotification", params);
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
    await handleSendCommentNotification.add("sendCommentNotification", params);
    console.log("Notification added on queue");
  } catch (error) {
    throw error;
  }
}
new Worker("handleSendLikeNotification", W_SendLikeNotification, {
  connection: redisDatabase,
});
new Worker("handleSendCommentNotification", W_SendCommentNotification, {
  connection: redisDatabase,
});
new Worker("handleNotificationSetting", W_CreateNotificationSetting, {
  connection: redisDatabase,
});
export const NotificationQueue = {
  like,
  comment,
  createSetting,
};
