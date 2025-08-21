const { prisma, connectDatabase } = require('../src/services/databaseService');

// Global test setup - simplified for stable operation
beforeAll(async () => {
    try {
        const isConnected = await connectDatabase();
        if (!isConnected) {
            throw new Error('Failed to connect to test database');
        }
        console.log('✅ Test database connected successfully');
    } catch (error) {
        console.error('❌ Test database connection failed:', error);
        throw error;
    }
});

afterAll(async () => {
    // Clean disconnect for tests
    try {
        await prisma.$disconnect();
        console.log('📝 Test cleanup completed');
    } catch (error) {
        console.error('❌ Test cleanup error:', error);
    }
});

// Make Prisma client available globally for tests
global.testPrisma = prisma;

// Enhanced test helpers for Next.js architecture
global.testHelpers = {
    // Wait for async operations
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

    // Clean up test data (improved with better error handling)
    async cleanupTestData() {
        try {
            // Clean up test data in dependency order
            await prisma.lyrics.deleteMany({
                where: { title: { contains: 'TEST' } },
            });
            await prisma.video.deleteMany({
                where: { title: { contains: 'TEST' } },
            });
            await prisma.event.deleteMany({
                where: { title: { contains: 'TEST' } },
            });
            await prisma.inventory.deleteMany({
                where: { title: { contains: 'TEST' } },
            });
            await prisma.bio.deleteMany({
                where: { id: { contains: 'test' } },
            });
        } catch (error) {
            console.warn('⚠️ Test cleanup warning:', error.message);
        }
    },

    // Create test data with improved error handling
    async createTestInventory() {
        try {
            return await prisma.inventory.create({
                data: {
                    id: 'test-item',
                    title: 'TEST ITEM',
                    price: 10.0,
                    sizes: ['S', 'M', 'L'],
                    inventory: { S: 5, M: 10, L: 3 },
                },
            });
        } catch (error) {
            console.error('❌ Test inventory creation failed:', error);
            return null;
        }
    },

    async createTestEvent() {
        try {
            return await prisma.event.create({
                data: {
                    id: 'test-event',
                    title: 'TEST EVENT',
                    date: '2025-12-31',
                    time: '8:00PM',
                    venue: 'Test Venue',
                    location: 'Test City, TS',
                    description: 'Test event description',
                    ticketLink: 'https://test.com',
                    isPast: false,
                },
            });
        } catch (error) {
            console.error('❌ Test event creation failed:', error);
            return null;
        }
    },

    async createTestVideo() {
        try {
            return await prisma.video.create({
                data: {
                    id: 'test-video',
                    youtubeId: 'TEST123456',
                    title: 'TEST VIDEO',
                    description: 'Test video description',
                    order: 999,
                },
            });
        } catch (error) {
            console.error('❌ Test video creation failed:', error);
            return null;
        }
    },

    async createTestLyrics() {
        try {
            return await prisma.lyrics.create({
                data: {
                    id: 'test-song',
                    title: 'TEST SONG',
                    lyrics: 'Test lyrics content',
                    order: 999,
                    isInstrumental: false,
                },
            });
        } catch (error) {
            console.error('❌ Test lyrics creation failed:', error);
            return null;
        }
    },

    // Next.js specific test helpers
    async testNextJSApiResponse(response) {
        expect(response).toBeDefined();
        expect(response.body).toBeDefined();
        expect(response.body.success).toBeDefined();
        return response.body;
    },

    // Test database state
    async verifyDatabaseState() {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error('❌ Database state verification failed:', error);
            return false;
        }
    },
};

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = 'http://localhost:3001';

// Global error handling for tests
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection in tests:', reason);
});
