/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    trailingSlash: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        unoptimized: true,
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.riskfortress.in',
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
        optimizePackageImports: [
            'three',
            'framer-motion',
            'lucide-react',
            'recharts',
            '@vercel/analytics',
            '@vercel/speed-insights',
            'sonner',
            'react-icons',
            'date-fns',
            'lodash',
            'clsx',
            'tailwind-merge',
        ],
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
        resolveAlias: {
            '@': './src',
        },
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        
        if (!isServer) {
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks?.cacheGroups,
                    framework: {
                        chunks: 'all',
                        name: 'framework',
                        test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                        priority: 40,
                        enforce: true,
                    },
                    lib: {
                        test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
                        name: 'lib',
                        chunks: 'all',
                        priority: 30,
                    },
                },
            };
        }
        
        return config;
    },
    compress: true,
    productionBrowserSourceMaps: false,
    poweredByHeader: false,
    generateEtags: true,
};

module.exports = nextConfig;
