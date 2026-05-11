import { Queue, Worker } from "bullmq";
import redisDatabase from "../../utils/redisConnection";
import { TlikeState } from "../../modules/post/post.controller";
import { W_likeHandler } from "../workers/postWorker";

const post = new Queue("handleLike", {
  connection: redisDatabase,
  defaultJobOptions: {
    removeOnComplete: true,
  },
});
async function handleLike(data: TlikeState) {
  try {
    await post.add("like", data);
    console.log("Job added to handleLike queue");
  } catch (error) {
    throw error;
  }
}
// Worker=======
new Worker("handleLike", W_likeHandler, { connection: redisDatabase });

export const PostQueue = {
  handleLike,
};
