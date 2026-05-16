import { Queue, Worker } from "bullmq";
import redisDatabase from "../../utils/redisConnection";
import { NotificationType } from "../../utils/notifications";
import { W_SendNotification } from "../workers/notificationWorker";

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
new Worker("handleSendNotification", W_SendNotification, {
  connection: redisDatabase,
});
export const NotificationQueue = {
  like,
};
