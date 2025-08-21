const cors = require('cors');
const { CLIENT_URL } = require('../config/environment');

// CORS configuration
const corsOptions = {
    origin: [
        CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
};

module.exports = cors(corsOptions);
