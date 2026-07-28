import { Worker } from 'bullmq';
import { redisClient } from '../../config/redisClient.js';
import { analyticsUpdates } from '../helper/Db.query.js';
import logger from '../../config/logger.js';

const worker = new Worker("analytics",
    async (job) => {
        const {
            id,
            userAgent,
            ipAdd,
            referrer,
        } = job.data;
        await analyticsUpdates(
            id,
            userAgent,
            ipAdd,
            referrer,
        );
    },
    {
        connection: redisClient,
        concurrency: 5,
    }
);

worker.on("ready", () => {
    logger.info("Worker Ready")
});

worker.on("active", (job) => {
    logger.info(
        `Processing Job ${job.id} | Attempt ${job.attemptsMade + 1}`
    );
});

worker.on("completed", (job ) => {
    logger.info(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    logger.error(`Job ${job.id} failed: | Attempt  ${(job.attemptsMade ?? 0) + 1} | ${err.message}`);
});

worker.on("stalled", ({ jobId }) => {
    logger.warn(`Job ${jobId} stalled`);
});

worker.on("error", (err) => {
    logger.error("Worker Error:", err);
});