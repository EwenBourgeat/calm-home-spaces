import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dl.airtable.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.airtableusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
