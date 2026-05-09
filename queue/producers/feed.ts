import { Queue } from "bullmq";

const feedPrepare = new Queue("feedPrepare", {
  connection: {
    path: process.env.RedisHost,
    port: Number(process.env.RedisPort as string),
  },
});

async function prepareFeed(postId: number) {
  const result = await feedPrepare.add("prepareFeed", {
    postId,
  });
}

export const feedQueue = {
  prepareFeed,
};
