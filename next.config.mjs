import { env as _ } from "./src/lib/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com"
      },
      {
        hostname: "lh3.googleusercontent.com"
      },
      {
        hostname: "img.clerk.com"
      }
    ]
  }
};

export default nextConfig;
