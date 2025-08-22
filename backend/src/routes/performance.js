const express = require('express');
const { getCacheStats } = require('../services/cacheService');
const { prisma } = require('../services/databaseService');

const router = express.Router();

// Performance monitoring endpoint (for admin use)
router.get('/stats', async (req, res) => {
    try {
        const startTime = Date.now();

        // Gather comprehensive performance metrics
        const performance = {
            cache: getCacheStats(),
            memory: {
                ...process.memoryUsage(),
                uptime: process.uptime(),
                nodeVersion: process.version,
            },
            database: await getDatabasePerformance(),
            response: {
                timestamp: new Date().toISOString(),
                responseTime: Date.now() - startTime,
            },
        };

        res.json({
            success: true,
            performance,
        });
    } catch (error) {
        console.error('❌ Performance stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to gather performance stats',
            message: error.message,
        });
    }
});

// Database performance analysis
async function getDatabasePerformance() {
    try {
        const startTime = Date.now();

        // Test common queries with timing
        const queries = await Promise.all([
            timeQuery('events', () =>
                prisma.event.findMany({ take: 5, orderBy: { date: 'desc' } })
            ),
            timeQuery('videos', () =>
                prisma.video.findMany({ take: 5, orderBy: { order: 'asc' } })
            ),
            timeQuery('lyrics', () =>
                prisma.lyrics.findMany({ take: 5, orderBy: { order: 'asc' } })
            ),
            timeQuery('inventory', () =>
                prisma.inventory.findMany({ take: 5 })
            ),
            timeQuery('bio', () => prisma.bio.findFirst()),
        ]);

        const totalTime = Date.now() - startTime;

        return {
            totalQueryTime: totalTime,
            averageQueryTime: totalTime / queries.length,
            queries: queries.reduce((acc, query) => {
                acc[query.name] = {
                    duration: query.duration,
                    recordCount: query.result?.length || (query.result ? 1 : 0),
                };
                return acc;
            }, {}),
            connectionStatus: 'active',
        };
    } catch (error) {
        console.error('❌ Database performance check failed:', error);
        return {
            error: error.message,
            connectionStatus: 'error',
        };
    }
}

// Utility function to time database queries
async function timeQuery(name, queryFunction) {
    const startTime = Date.now();
    try {
        const result = await queryFunction();
        const duration = Date.now() - startTime;

        return {
            name,
            duration,
            result,
            status: 'success',
        };
    } catch (error) {
        const duration = Date.now() - startTime;

        return {
            name,
            duration,
            result: null,
            status: 'error',
            error: error.message,
        };
    }
}

// Cache benchmark endpoint (for testing cache performance)
router.get('/cache-benchmark', async (req, res) => {
    try {
        const iterations = parseInt(req.query.iterations) || 10;
        const dataService = require('../services/dataService');

        console.log(
            `🏃‍♂️ Running cache benchmark with ${iterations} iterations...`
        );

        const benchmarks = [];

        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();

            // Test cached vs uncached performance
            await Promise.all([
                dataService.getAllEvents(),
                dataService.getAllVideos(),
                dataService.getAllLyrics(),
                dataService.getBio(),
                dataService.getInventory(),
            ]);

            const duration = Date.now() - startTime;
            benchmarks.push(duration);
        }

        const avgTime =
            benchmarks.reduce((a, b) => a + b, 0) / benchmarks.length;
        const minTime = Math.min(...benchmarks);
        const maxTime = Math.max(...benchmarks);

        res.json({
            success: true,
            benchmark: {
                iterations,
                times: benchmarks,
                averageTime: avgTime,
                minTime,
                maxTime,
                cacheStats: getCacheStats(),
            },
        });
    } catch (error) {
        console.error('❌ Cache benchmark error:', error);
        res.status(500).json({
            success: false,
            error: 'Cache benchmark failed',
            message: error.message,
        });
    }
});

module.exports = router;
