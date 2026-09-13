import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination:
          "https://spam-email-backend.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;