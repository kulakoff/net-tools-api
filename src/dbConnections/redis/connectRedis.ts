import { createClient } from "redis";
import { appConfig } from "../../config";

const redisUrl = appConfig.REDIS_URL;
const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connected...");
  } catch (err: any) {
    console.log(err.message);
    //reconnect to redis
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

redisClient.on("error", (err) => console.log(err));

export default redisClient;
