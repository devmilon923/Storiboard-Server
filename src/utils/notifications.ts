import { prisma } from "./prisma";

export type NotificationType = {
  senderId: number;
  receiverId: number;
  title: string;
  content: string;
  ref?: string; // url of page
  notiType:
    | "LIKE_ON_POST"
    | "LIKE_ON_COMMENT"
    | "COMMENT_ON_POST"
    | "REPLIE_ON_COMMENT"
    | "REPLIE_ON_REPLIE"
    | "FOLLOW";
};

const sendNotification = async (payload: NotificationType) => {
  try {
    //TODO
    // implement socket

    const result = await prisma.notifications.create({
      data: {
        sender: { connect: { id: payload.senderId } },
        receiver: { connect: { id: payload.receiverId } },
        content: payload.content,
        title: payload.title,
        notiType: payload.notiType,
        ref: payload.ref,
      },
    });
    return result;
  } catch (error) {
    return false;
  }
};
