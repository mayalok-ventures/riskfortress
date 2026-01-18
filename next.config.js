/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,  // Static export for Cloudflare Pages
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        unoptimized: true,
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.riskfortress.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['three', 'framer-motion', 'lucide-react', 'recharts'],
    },
    // Add turbopack config to silence the warning
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    // Keep webpack config for production builds
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    // Headers are handled by Cloudflare via public/_headers file
    compress: true,
    productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
