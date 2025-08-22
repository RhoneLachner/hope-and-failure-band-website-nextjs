const { PrismaClient } = require('../generated/prisma');

// PRODUCTION-READY: Use direct URL for development, pooled for production
const getDatabaseUrl = () => {
    // Use DIRECT_URL for development to avoid prepared statement conflicts
    // Use DATABASE_URL (pooled) for production
    if (process.env.NODE_ENV === 'production') {
        return process.env.DATABASE_URL;
    }
    return process.env.DIRECT_URL || process.env.DATABASE_URL;
};

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: getDatabaseUrl(),
        },
    },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    errorFormat: 'minimal',
});

// PRODUCTION: Robust connection with health check
async function connectDatabase() {
    try {
        // Connect to database
        await prisma.$connect();

        // Health check to ensure connection works
        await prisma.$queryRaw`SELECT 1 as health_check`;

        const urlType =
            process.env.NODE_ENV === 'production' ? 'pooled' : 'direct';
        console.log(`✅ Database connected (${urlType} connection)`);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// PRODUCTION: Graceful disconnect with timeout
async function disconnectDatabase() {
    try {
        // Set timeout to prevent hanging disconnects
        const disconnectPromise = prisma.$disconnect();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Disconnect timeout')), 5000)
        );

        await Promise.race([disconnectPromise, timeoutPromise]);
        console.log('📝 Database disconnected cleanly');
    } catch (error) {
        console.error('❌ Disconnect error:', error.message);
        // Force exit if disconnect hangs
        if (error.message === 'Disconnect timeout') {
            console.log('🔨 Force closing database connection');
        }
    }
}

// SIMPLE: Clean shutdown
process.on('SIGINT', async () => {
    await disconnectDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectDatabase();
    process.exit(0);
});

// SIMPLE: Just export the basics
module.exports = {
    prisma,
    connectDatabase,
    disconnectDatabase,
};
