// Simple authentication middleware for admin routes
function requireAdmin(req, res, next) {
    const { password } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - Invalid admin password',
        });
    }

    next();
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

module.exports = {
    requireAdmin,
    extractPassword,
};
