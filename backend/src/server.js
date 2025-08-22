const express = require('express');
require('./config/environment'); // Load environment variables

const corsMiddleware = require('./middleware/cors');
const { apiRateLimit, securityHeaders } = require('./middleware/security');
const { sanitizeInput } = require('./middleware/validation');

// Import route handlers
const inventoryRoutes = require('./routes/inventory');
const eventsRoutes = require('./routes/events');
const videosRoutes = require('./routes/videos');
const bioRoutes = require('./routes/bio');
const lyricsRoutes = require('./routes/lyrics');
const stripeRoutes = require('./routes/stripe');

// Import database
const { connectDatabase, prisma } = require('./services/databaseService');
const { initializeInventory } = require('./models/inventory');
const { initializeEvents } = require('./models/events');
const { initializeVideos } = require('./models/videos');
const { initializeBio } = require('./models/bio');
const { initializeLyrics } = require('./models/lyrics');

const app = express();

// Security headers (apply first)
app.use(securityHeaders);

// Global middleware
app.use(corsMiddleware);

// Rate limiting for all API routes
app.use('/api', apiRateLimit);

// Input sanitization middleware
app.use(sanitizeInput);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/admin/events', eventsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/admin/videos', videosRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/admin/bio', bioRoutes);
app.use('/api/lyrics', lyricsRoutes);
app.use('/api/admin/lyrics', lyricsRoutes);
app.use('/api', stripeRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const checks = {
            database: await checkDatabase(),
            stripe: await checkStripe(),
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };

        const allHealthy = Object.values(checks).every((check) =>
            typeof check === 'object' && check.status
                ? check.status === 'ok'
                : true
        );

        res.status(allHealthy ? 200 : 503).json(checks);
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Health check failed',
            timestamp: new Date().toISOString(),
            error: error.message,
        });
    }
});

// Health check helper functions
async function checkDatabase() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'ok', message: 'Database connected' };
    } catch (error) {
        return {
            status: 'error',
            message: 'Database disconnected',
            error: error.message,
        };
    }
}

async function checkStripe() {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return { status: 'error', message: 'Stripe not configured' };
        }
        return { status: 'ok', message: 'Stripe configured' };
    } catch (error) {
        return {
            status: 'error',
            message: 'Stripe check failed',
            error: error.message,
        };
    }
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.path,
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message:
            process.env.NODE_ENV === 'development'
                ? error.message
                : 'Something went wrong',
    });
});

// SIMPLE: Start server without complex initialization
async function startServer() {
    try {
        // SIMPLE: Just connect
        const isConnected = await connectDatabase();
        if (!isConnected) {
            console.log(
                '⚠️ Database connection failed, but starting server anyway...'
            );
        }

        // Initialize data on fresh database
        console.log('🌱 Initializing database data...');
        try {
            await initializeInventory();
            await initializeEvents();
            await initializeVideos();
            await initializeBio();
            await initializeLyrics();
            console.log('✅ Database initialization completed');
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
        }

        // PRODUCTION: Start server with proper error handling
        const { PORT } = require('./config/environment');
        const server = app.listen(PORT, () => {
            console.log(`🚀 PRODUCTION Server running on port ${PORT}`);
            console.log('💡 Using prepared_statements=false for stability');
            console.log('✅ Ready for production traffic');
        });

        // PRODUCTION: Handle server errors gracefully
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
                console.log(`💡 Try: lsof -ti:${PORT} | xargs kill -9`);
                process.exit(1);
            } else {
                console.error('❌ Server error:', error.message);
            }
        });
    } catch (error) {
        console.error('❌ Server failed:', error.message);
        process.exit(1);
    }
}

// Start the server
startServer();

module.exports = app;
