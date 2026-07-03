import { RateLimiterRedis } from 'rate-limiter-flexible';
import { limiterRedis } from '../../config/redisLimiter.js';

export const ipLimiter = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "forgot-pass-ip",
    points: 10,
    duration: 60 * 60,
});

export const emailLimiter = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "forgot-password-email",
    points: 3,
    duration: 60 * 60,
});