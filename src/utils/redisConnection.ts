import Redis from "ioredis";
console.log(process.env.RedisPort);
const redisDatabase = new Redis({
  host: process.env.RedisHost as string,
  port: parseInt(process.env.RedisPort as string),
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

export default redisDatabase;
