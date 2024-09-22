import { env as _ } from "./src/lib/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true
    }
  }
};

export default nextConfig;
