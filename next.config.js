/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // experimental: {
  //   appDir: true,
  // },
}

module.exports = nextConfig
