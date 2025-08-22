const bcrypt = require('bcrypt');

// Secure authentication middleware for admin routes
async function requireAdmin(req, res, next) {
    try {
        const { password } = req.body;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // Check if password is provided
        if (!password) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required - Password missing',
            });
        }

        // Check if admin hash is configured
        if (!adminPasswordHash) {
            console.error(
                '⚠️ ADMIN_PASSWORD_HASH not configured in environment variables'
            );
            return res.status(500).json({
                success: false,
                error: 'Server configuration error',
            });
        }

        // Verify password against hash
        const isValidPassword = await bcrypt.compare(
            password,
            adminPasswordHash
        );

        if (!isValidPassword) {
            // Log failed authentication attempts (without exposing password)
            console.warn(
                `❌ Failed admin authentication attempt from ${
                    req.ip
                } at ${new Date().toISOString()}`
            );
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Log successful authentication
        console.log(
            `✅ Admin authenticated from ${
                req.ip
            } at ${new Date().toISOString()}`
        );
        next();
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed',
        });
    }
}

// Extract password from request body (for routes that need it)
function extractPassword(req, res, next) {
    if (req.body.password) {
        req.adminPassword = req.body.password;
        // Remove password from body to avoid passing it to services
        const { password, ...bodyWithoutPassword } = req.body;
        req.body = bodyWithoutPassword;
    }
    next();
}

// Rate limiting specifically for admin routes
const adminRateLimit = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        error: 'Too many admin authentication attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    requireAdmin,
    extractPassword,
    adminRateLimit,
};
