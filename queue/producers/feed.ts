import { Queue } from "bullmq";

const feedPrepare = new Queue("feedPrepare", {
  connection: {
    path: process.env.RedisHost,
    port: Number(process.env.RedisPort as string),
  },
});

async function prepareFeed(postId: number) {
  try {
    await feedPrepare.add("prepareFeed", {
      postId,
    });
  } catch (error) {
    throw error;
  }
}

export const feedQueue = {
  prepareFeed,
};
