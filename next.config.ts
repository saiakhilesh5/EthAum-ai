import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Optimize output
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
