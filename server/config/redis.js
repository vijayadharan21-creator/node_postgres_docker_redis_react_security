import { createClient } from "redis";

const redisHost = process.env.REDIS_HOST || process.env.redisHost || process.env.redishost || "redis";
const redisPort = process.env.REDIS_PORT || process.env.redisPort || 6379;

export const redisClient = createClient({
    socket: {
        host: redisHost,
        port: Number(redisPort)
    }
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err.message);
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("Redis connected successfully");
});
