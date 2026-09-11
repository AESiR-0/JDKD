import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 85 is for the video posters: night footage bands visibly at 75.
    qualities: [75, 85],
  },
};

export default nextConfig;
