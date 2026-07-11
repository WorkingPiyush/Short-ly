import Redis from 'ioredis';
import logger from './logger.js';

export const limiterRedis = new Redis(process.env.REDIS_URL);

limiterRedis.on("connect", () => {
    logger.info("Limiter Redis connected");
});

limiterRedis.on("error", (err) => {
    logger.error("Limiter Redis Error", err);
});