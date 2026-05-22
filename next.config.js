/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  // Prevent build errors from optional server-only packages
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Mark these as external to prevent bundling issues
  experimental: {
    serverComponentsExternalPackages: ['pusher', 'razorpay'],
  },
};

module.exports = nextConfig;
