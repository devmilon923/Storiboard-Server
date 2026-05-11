import Redis from "ioredis";
const redisDatabase = new Redis({
  host: process.env.RedisHost as string,
  port: parseInt(process.env.RedisPort as string),
  retryStrategy: (times) => Math.min(times * 50, 2000),
  enableReadyCheck: true,
  enableOfflineQueue: true,
  maxRetriesPerRequest: null,
});

// Connection event listeners
redisDatabase.on("connect", () => {
  console.log("✓ Redis Connected Successfully");
});
redisDatabase.on("error", (err) => {
  console.error("✗ Redis Connection Error:", err.message);
});

redisDatabase.on("reconnecting", () => {
  console.log("⟳ Redis Reconnecting...");
});

// Wait for connection before export
redisDatabase.on("ready", () => {
  console.log("✓ Redis Ready");
});

export default redisDatabase;
