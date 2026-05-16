import { Queue } from "bullmq";
import redisDatabase from "../../utils/redisConnection";
import { NotificationType } from "../../utils/notifications";

const handleSendNotification = new Queue("handleSendNotification", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});

async function send(params: NotificationType) {
  try {
    await handleSendNotification.add("sendNotification", params);
    console.log("Notification added on queue");
  } catch (error) {
    throw error;
  }
}

export const NotificationQueue = {
  send,
};
