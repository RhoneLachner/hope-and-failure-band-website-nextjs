const {
    describe,
    test,
    expect,
    beforeAll,
    afterEach,
} = require('@jest/globals');
const {
    connectDatabase,
    disconnectDatabase,
    prisma,
} = require('../../src/services/databaseService');

describe('Database Connection Tests', () => {
    afterEach(async () => {
        // Clean up any test data after each test
        await global.testHelpers.cleanupTestData();
    });

    test('should connect to database successfully', async () => {
        const isConnected = await connectDatabase();
        expect(isConnected).toBe(true);
    });

    test('should execute basic query', async () => {
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        expect(result).toHaveLength(1);
        expect(result[0].test).toBe(1);
    });

    test('should handle database errors gracefully', async () => {
        // Test with invalid query
        await expect(
            prisma.$queryRaw`SELECT * FROM non_existent_table`
        ).rejects.toThrow();
    });

    test('should verify all tables exist', async () => {
        // Check that all expected tables exist
        const tables = ['inventory', 'events', 'videos', 'bio', 'lyrics'];

        for (const table of tables) {
            const result = await prisma.$queryRaw`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = ${table}
                );
            `;
            expect(result[0].exists).toBe(true);
        }
    });

    test('should verify database schema integrity', async () => {
        // Test that we can perform basic operations on each table
        const operations = [
            () => prisma.inventory.findMany({ take: 1 }),
            () => prisma.event.findMany({ take: 1 }),
            () => prisma.video.findMany({ take: 1 }),
            () => prisma.bio.findMany({ take: 1 }),
            () => prisma.lyrics.findMany({ take: 1 }),
        ];

        // All operations should succeed without throwing
        for (const operation of operations) {
            await expect(operation()).resolves.toBeDefined();
        }
    });

    test('should handle concurrent database connections', async () => {
        // Test multiple concurrent queries
        const promises = Array.from(
            { length: 5 },
            (_, i) => prisma.$queryRaw`SELECT ${i} as connection_test`
        );

        const results = await Promise.all(promises);
        expect(results).toHaveLength(5);

        results.forEach((result, index) => {
            expect(result[0].connection_test).toBe(index);
        });
    });

    test('should maintain connection pool health', async () => {
        // Test that connection pool can handle multiple operations
        const start = Date.now();

        // Perform multiple operations
        await Promise.all([
            prisma.inventory.count(),
            prisma.event.count(),
            prisma.video.count(),
            prisma.bio.count(),
            prisma.lyrics.count(),
        ]);

        const duration = Date.now() - start;

        // Should complete within reasonable time (connection pooling working)
        expect(duration).toBeLessThan(5000); // 5 seconds max
    });
});

describe('Database Performance Tests', () => {
    test('should handle large query operations efficiently', async () => {
        const start = Date.now();

        // Perform complex query operation
        const result = await prisma.$queryRaw`
            SELECT
                'inventory' as table_name, COUNT(*) as count
            FROM inventory
            UNION ALL
            SELECT
                'events' as table_name, COUNT(*) as count
            FROM events
            UNION ALL
            SELECT
                'videos' as table_name, COUNT(*) as count
            FROM videos
            UNION ALL
            SELECT
                'lyrics' as table_name, COUNT(*) as count
            FROM lyrics
        `;

        const duration = Date.now() - start;

        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should handle database stress test', async () => {
        const operations = Array.from(
            { length: 20 },
            () => prisma.$queryRaw`SELECT NOW() as timestamp`
        );

        const start = Date.now();
        const results = await Promise.all(operations);
        const duration = Date.now() - start;

        expect(results).toHaveLength(20);
        expect(duration).toBeLessThan(3000); // Should handle 20 concurrent operations within 3 seconds
    });
});
