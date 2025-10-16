import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Include http for maximum flexibility (if needed)
        hostname: '**',   // WARNING: This allows ALL hostnames
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', // The secure protocol is usually sufficient
        hostname: '**',   // WARNING: This allows ALL hostnames
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;