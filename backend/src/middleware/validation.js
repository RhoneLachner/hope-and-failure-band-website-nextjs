// Request validation middleware

// Validate required fields in request body
function validateRequired(fields) {
    return (req, res, next) => {
        const missing = fields.filter((field) => !req.body[field]);

        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missing.join(', ')}`,
            });
        }

        next();
    };
}

// Validate email format
function validateEmail(req, res, next) {
    const { customerEmail, email } = req.body;
    const emailToValidate = customerEmail || email;

    if (emailToValidate) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailToValidate)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format',
            });
        }
    }

    next();
}

// Validate array of items for cart operations
function validateItems(req, res, next) {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or empty items array',
        });
    }

    // Validate each item has required fields
    for (const item of items) {
        if (!item.id || !item.quantity || item.quantity <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Each item must have id and positive quantity',
            });
        }
    }

    next();
}

// Validate numeric values
function validateNumeric(fields) {
    return (req, res, next) => {
        for (const field of fields) {
            if (req.body[field] !== undefined) {
                const value = Number(req.body[field]);
                if (isNaN(value) || value < 0) {
                    return res.status(400).json({
                        success: false,
                        error: `${field} must be a valid non-negative number`,
                    });
                }
                req.body[field] = value; // Convert to number
            }
        }
        next();
    };
}

module.exports = {
    validateRequired,
    validateEmail,
    validateItems,
    validateNumeric,
};
