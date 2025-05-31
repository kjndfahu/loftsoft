/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
        reactStrictMode:false
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '', // Leave empty for default HTTPS port
                pathname: '/**', // Allow all paths under res.cloudinary.com
            },
        ],
    },
};

export default nextConfig;
