const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://luminos-mvp-6bcf42d6-api.onrender.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;