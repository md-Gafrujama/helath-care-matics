import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  // Hide the bottom-left Next.js/Turbopack black badge in local/dev UI
  devIndicators: false,
};

export default nextConfig;
