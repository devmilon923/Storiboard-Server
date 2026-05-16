import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";

const getAllNotifications = handleAsync(
  async (req: Request, res: Response) => {},
);
export const NotificationController = {
  getAllNotifications,
};
