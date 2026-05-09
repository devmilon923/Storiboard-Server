import { Job, Worker } from "bullmq";
import redisDatabase from "../../utils/redisConnection";

const feedWorker = new Worker(
  "feedPrepare",
  async (job: Job<any, any, string>) => {
    console.log(job.id, "Prossing job");
  },
  { connection: redisDatabase },
);
