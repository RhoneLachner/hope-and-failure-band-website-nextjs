const winston = require('winston');
const path = require('path');

// Ensure logs directory exists
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
        })
    ),
    transports: [
        // Error log file
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 10,
        }),
        // Console output in development
        ...(process.env.NODE_ENV !== 'production'
            ? [
                  new winston.transports.Console({
                      format: winston.format.combine(
                          winston.format.colorize(),
                          winston.format.simple()
                      ),
                  }),
              ]
            : []),
    ],
});

// Request logging middleware
function requestLogger(req, res, next) {
    const start = Date.now();

    // Log request
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (...args) {
        const duration = Date.now() - start;
        logger.info(
            `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
        );
        originalEnd.apply(this, args);
    };

    next();
}

// Security event logger
function logSecurityEvent(event, details = {}) {
    logger.warn(`SECURITY EVENT: ${event}`, {
        ...details,
        timestamp: new Date().toISOString(),
    });
}

// Database operation logger
function logDatabaseOperation(operation, table, details = {}) {
    logger.info(`DATABASE: ${operation} on ${table}`, {
        ...details,
        timestamp: new Date().toISOString(),
    });
}

module.exports = {
    logger,
    requestLogger,
    logSecurityEvent,
    logDatabaseOperation,
};
