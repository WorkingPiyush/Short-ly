import 'dotenv/config';
import logger from './logger.js';
import Redis from 'ioredis';

export const redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});


redisClient.on("connect", () => {
    logger.info("Redis Client connected");
});

redisClient.on("error", (err) => {
    logger.error("Redis Client Error", err);
});



