import { Queue } from 'bullmq';
import { redisClient } from '../../config/redisClient.js';

export const analyticsQueue = new Queue("analytics",{
    connection: redisClient,
})
