import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

export const client = globalForPrisma.prisma || new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    log: []
});


if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
}

process.on('beforeExit', async () => {
    await client.$disconnect();
    process.exit(0);
});

// await client.$queryRaw`SELECT 1`;
// console.log('DB connected');