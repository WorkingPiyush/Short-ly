import { Worker } from 'bullmq';
import { redisClient } from '../../config/redisClient.js';
import { analyticsUpdates } from '../helper/Db.query.js';

const worker = new Worker("analytics",
    async (job) => {
        console.log("=================================");
        console.log("Job Received");
        console.log(job.id);
        console.log(job.name);
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
    }
);
worker.on("ready", () => {
    console.log("✅ Worker Ready");
})
worker.on("error", (err) => {
    console.error(err);
});

console.log("Analytics Worker Started");