// Cache Service for Performance Optimization
// Implements in-memory caching for read-heavy database operations

const NodeCache = require('node-cache');

// Create cache instances with different TTL (Time To Live) strategies
const caches = {
    // Short-lived cache for dynamic content (5 minutes)
    dynamic: new NodeCache({
        stdTTL: 300, // 5 minutes
        checkperiod: 60, // Check for expired keys every minute
        useClones: false, // Return references for better performance
    }),

    // Medium cache for semi-static content (15 minutes)
    semiStatic: new NodeCache({
        stdTTL: 900, // 15 minutes
        checkperiod: 120, // Check every 2 minutes
        useClones: false,
    }),

    // Long-lived cache for static content (1 hour)
    static: new NodeCache({
        stdTTL: 3600, // 1 hour
        checkperiod: 300, // Check every 5 minutes
        useClones: false,
    }),
};

// Cache key generators
const generateKey = (prefix, ...params) => {
    return `${prefix}:${params.filter((p) => p !== undefined).join(':')}`;
};

// Generic cache wrapper function
async function cacheWrapper(key, fetchFunction, cacheType = 'dynamic') {
    try {
        // Try to get from cache first
        const cached = caches[cacheType].get(key);
        if (cached !== undefined) {
            console.log(`📋 Cache HIT: ${key}`);
            return cached;
        }

        // Cache miss - fetch from database
        console.log(`📋 Cache MISS: ${key}`);
        const data = await fetchFunction();

        // Store in cache for future requests
        caches[cacheType].set(key, data);

        return data;
    } catch (error) {
        console.error(`❌ Cache error for key ${key}:`, error);
        // Fallback to direct database call
        return await fetchFunction();
    }
}

// Cache invalidation functions
function invalidateCache(pattern) {
    Object.values(caches).forEach((cache) => {
        const keys = cache.keys();
        keys.forEach((key) => {
            if (key.includes(pattern)) {
                cache.del(key);
                console.log(`🗑️ Cache invalidated: ${key}`);
            }
        });
    });
}

function invalidateAllCaches() {
    Object.values(caches).forEach((cache) => cache.flushAll());
    console.log('🗑️ All caches cleared');
}

// Specific cache invalidation functions for each content type
const invalidation = {
    events: () => invalidateCache('events'),
    videos: () => invalidateCache('videos'),
    lyrics: () => invalidateCache('lyrics'),
    bio: () => invalidateCache('bio'),
    inventory: () => invalidateCache('inventory'),
    all: invalidateAllCaches,
};

// Cache statistics
function getCacheStats() {
    const stats = {};
    Object.entries(caches).forEach(([name, cache]) => {
        stats[name] = {
            keys: cache.keys().length,
            hits: cache.getStats().hits || 0,
            misses: cache.getStats().misses || 0,
            hitRate:
                cache.getStats().hits /
                    (cache.getStats().hits + cache.getStats().misses) || 0,
        };
    });
    return stats;
}

// Cache warming functions (pre-populate cache with common queries)
async function warmCache(dataService) {
    try {
        console.log('🔥 Warming caches...');

        // Pre-cache common queries
        await Promise.all([
            cacheWrapper(
                'events:all',
                () => dataService.getAllEvents(),
                'semiStatic'
            ),
            cacheWrapper(
                'videos:all',
                () => dataService.getAllVideos(),
                'static'
            ),
            cacheWrapper(
                'lyrics:all',
                () => dataService.getAllLyrics(),
                'static'
            ),
            cacheWrapper('bio:main', () => dataService.getBio(), 'static'),
            cacheWrapper(
                'inventory:all',
                () => dataService.getInventory(),
                'dynamic'
            ),
        ]);

        console.log('✅ Cache warming completed');
    } catch (error) {
        console.error('❌ Cache warming failed:', error);
    }
}

module.exports = {
    cacheWrapper,
    generateKey,
    invalidation,
    getCacheStats,
    warmCache,

    // Export cache types for external use
    CACHE_TYPES: {
        DYNAMIC: 'dynamic', // 5 minutes - for inventory, orders
        SEMI_STATIC: 'semiStatic', // 15 minutes - for events
        STATIC: 'static', // 1 hour - for videos, lyrics, bio
    },
};
