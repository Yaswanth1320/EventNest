import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This will skip ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // typescript: {
  //   // Warning: This will allow builds even with type errors
  //   ignoreBuildErrors: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
