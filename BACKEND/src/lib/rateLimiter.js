import { RateLimiterRedis } from 'rate-limiter-flexible';
import { limiterRedis } from '../../config/redisLimiter.js';

export const forgetPassword = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "forgot-pass-ip",
    points: 10,
    duration: 60 * 60,
});

export const emailpassword = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "forgot-password-email",
    points: 5,
    duration: 60 * 60,
});

export const signup = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "signup",
    points: 5,
    duration: 60 * 30,
    blockDuration: 60 * 30,
});

export const login = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "login",
    points: 5,
    duration: 60 * 15,
    blockDuration: 60 * 15,
});

export const userInfo = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "user_info",
    points: 15,
    duration: 60 * 30,
    blockDuration: 60 * 15,
})

export const profileUpdate = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "update_profile",
    points: 7,
    duration: 60 * 20,
    blockDuration: 60 * 20,
});

export const urlCreate = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "url_create",
    points: 20,
    duration: 60 * 30,
    blockDuration: 60 * 25,
});

export const bulkUrl = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "url_bulk_create",
    points: 5,
    duration: 60 * 10,
    blockDuration: 60 * 27,
});

export const allUrl = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "url_all",
    points: 50,
    duration: 60 * 45,
    blockDuration: 60 * 27,
});

export const url = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "single_url",
    points: 50,
    duration: 60 * 30,
    blockDuration: 60 * 27,
});

export const allAnalytics = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "url_analytics",
    points: 25,
    duration: 60 * 30,
    blockDuration: 60 * 27,
});
export const urlAnalytics = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "single_url_analytics",
    points: 25,
    duration: 60 * 30,
    blockDuration: 60 * 27,
});
export const urlUpdate = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "url_update",
    points: 25,
    duration: 60 * 30,
    blockDuration: 60 * 27,
});
export const aiSuggestions = new RateLimiterRedis({
    storeClient: limiterRedis,
    keyPrefix: "url_shortCode_suggestions",
    points: 20,
    duration: 60 * 30,
    blockDuration: 60 * 27,
});

