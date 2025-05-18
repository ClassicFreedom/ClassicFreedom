/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig 