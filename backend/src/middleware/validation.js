const validator = require('validator');

// Sanitize string inputs to prevent XSS
function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return validator.escape(str.trim());
}

// Comprehensive input sanitization middleware
function sanitizeInput(req, res, next) {
    try {
        // Sanitize body
        if (req.body && typeof req.body === 'object') {
            Object.keys(req.body).forEach((key) => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = sanitizeString(req.body[key]);
                }
            });
        }

        // Sanitize query parameters
        if (req.query && typeof req.query === 'object') {
            Object.keys(req.query).forEach((key) => {
                if (typeof req.query[key] === 'string') {
                    req.query[key] = sanitizeString(req.query[key]);
                }
            });
        }

        // Sanitize URL parameters
        if (req.params && typeof req.params === 'object') {
            Object.keys(req.params).forEach((key) => {
                if (typeof req.params[key] === 'string') {
                    req.params[key] = sanitizeString(req.params[key]);
                }
            });
        }

        next();
    } catch (error) {
        console.error('❌ Input sanitization error:', error);
        res.status(400).json({
            success: false,
            error: 'Invalid input format',
        });
    }
}

// Validate email format
function validateEmail(email) {
    return validator.isEmail(email);
}

// Validate required fields
function validateRequired(fields) {
    return (req, res, next) => {
        const missing = [];

        fields.forEach((field) => {
            if (!req.body[field] && req.body[field] !== 0) {
                missing.push(field);
            }
        });

        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missing.join(', ')}`,
            });
        }

        next();
    };
}

// Validate event data
function validateEvent(req, res, next) {
    const { title, date, venue, ticketUrl } = req.body;

    const errors = [];

    if (!title || title.length < 1 || title.length > 200) {
        errors.push('Title must be 1-200 characters');
    }

    if (!date || !validator.isISO8601(date)) {
        errors.push('Date must be a valid ISO 8601 date');
    }

    if (!venue || venue.length < 1 || venue.length > 200) {
        errors.push('Venue must be 1-200 characters');
    }

    if (
        ticketUrl &&
        !validator.isURL(ticketUrl, { protocols: ['http', 'https'] })
    ) {
        errors.push('Ticket URL must be a valid URL');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }

    next();
}

// Validate video data
function validateVideo(req, res, next) {
    const { youtubeId, title, description } = req.body;

    const errors = [];

    if (!youtubeId || !/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
        errors.push(
            'YouTube ID must be 11 characters (letters, numbers, underscore, hyphen)'
        );
    }

    if (!title || title.length < 1 || title.length > 200) {
        errors.push('Title must be 1-200 characters');
    }

    if (description && description.length > 1000) {
        errors.push('Description must be under 1000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }

    next();
}

// Validate inventory data
function validateInventory(req, res, next) {
    const { productId, size, quantity } = req.body;

    const errors = [];

    if (!productId || typeof productId !== 'string') {
        errors.push('Product ID is required and must be a string');
    }

    if (!size || !['S', 'M', 'L', 'XL', 'XXL'].includes(size)) {
        errors.push('Size must be one of: S, M, L, XL, XXL');
    }

    if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
        errors.push('Quantity must be a non-negative integer');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
        });
    }

    next();
}

module.exports = {
    sanitizeInput,
    validateEmail,
    validateRequired,
    validateEvent,
    validateVideo,
    validateInventory,
};
