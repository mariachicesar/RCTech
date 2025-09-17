import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Helps with client component bundling
    optimizePackageImports: ['@mdxeditor/editor'],
  },
  // Fix for client reference manifest issues
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "techconsulting-rc.s3.us-west-1.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
