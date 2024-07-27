import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_AI_API_KEY: z.string().min(1),
    SUPABASE_API_URL: z.string().url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1)
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {},
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    SUPABASE_API_URL: process.env.SUPABASE_API_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET
  }
});
