/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig 