/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
    },
    webpack: (config) => {
        // Add alias for shared directory
        config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3000/api/:path*',
            },
        ];
    },
    // Enable static file serving from public directory
    images: {
        domains: [],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
};

module.exports = nextConfig;
