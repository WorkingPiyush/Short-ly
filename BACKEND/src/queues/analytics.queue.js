import { Queue } from 'bullmq';
import { redisClient } from '../../config/redisClient.js';

export const analyticsQueue = new Queue("analytics", {
    connection: redisClient,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
    }
})
