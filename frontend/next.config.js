/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    // PERFORMANCE: Enable experimental features for better performance
    experimental: {
        // Enable modern bundling optimizations
        optimizePackageImports: ['react', 'react-dom'],
        // Reduce JavaScript bundle size
        optimizeCss: true,
    },

    // SASS Configuration
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
    },

    // PERFORMANCE: Webpack optimizations
    webpack: (config, { isServer }) => {
        // Add alias for shared directory
        config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');

        // PERFORMANCE: Optimize for production builds
        if (!isServer) {
            // Reduce bundle size by splitting vendor chunks
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    admin: {
                        test: /[\\/]src[\\/]components[\\/]admin[\\/]/,
                        name: 'admin',
                        chunks: 'all',
                        enforce: true,
                    },
                },
            };
        }

        return config;
    },

    // API Proxy for development
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3000/api/:path*',
            },
        ];
    },

    // PERFORMANCE: Optimized image configuration
    images: {
        // Enable modern image formats
        formats: ['image/webp', 'image/avif'],
        // Optimize device sizes for performance
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Allow external domains if needed
        domains: [],
    },

    // PERFORMANCE: Compiler optimizations
    compiler: {
        // Remove console.logs in production
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // PERFORMANCE: Output optimizations
    output: 'standalone',

    // PERFORMANCE: Enable compression
    compress: true,

    // PERFORMANCE: Generate static files when possible
    trailingSlash: false,

    // PERFORMANCE: Security headers for better performance
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                // Cache static assets for better performance
                source: '/assets/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
