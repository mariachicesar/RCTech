import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Helps with client component bundling
    optimizePackageImports: ['@mdxeditor/editor'],
    // Fix for client reference manifest issues
    optimizeCss: false,
    serverComponentsExternalPackages: [],
  },
  // Fix for client reference manifest issues
  serverExternalPackages: [],
  // Ensure proper bundling
  bundlePagesRouterDependencies: true,
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
    
    // Fix for client reference manifest issues
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization?.splitChunks,
        cacheGroups: {
          ...config.optimization?.splitChunks?.cacheGroups,
          default: false,
          vendors: false,
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;
