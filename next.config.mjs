/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Moved to root level
    eslint: {
        ignoreDuringBuilds: true,
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