import 'dotenv/config';
import { createClient } from 'redis';
import logger from './logger.js';

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

redisClient.on('error', (err) => {
    logger.error("Redis Error", err)
})

await redisClient.connect();