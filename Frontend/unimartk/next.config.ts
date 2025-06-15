import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: [
      "images.pexels.com",
      "unimarkt-bucket.s3.eu-central-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
