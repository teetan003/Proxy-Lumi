import { Queue, Worker } from 'bullmq';
import prisma from '../utils/prisma.js';
import { regenerate3Proxy } from '../services/proxyService.js';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

export const expireQueue = new Queue('expire-proxies', { connection });

export const expireWorker = new Worker('expire-proxies', async job => {
    console.log('Checking for expired proxies...');
    
    const expired = await prisma.proxy.updateMany({
        where: {
            status: 'active',
            expiresAt: {
                lt: new Date()
            }
        },
        data: {
            status: 'expired'
        }
    });

    if (expired.count > 0) {
        console.log(`Expired ${expired.count} proxies.`);
        await regenerate3Proxy();
    }
}, { connection });

// Function to schedule the recurring job
export const scheduleExpirationCheck = async () => {
    await expireQueue.add('check-expiration', {}, {
        repeat: {
            every: 60000 // Every 1 minute
        }
    });
};
