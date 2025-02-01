import { createEnv } from "@t3-oss/env-nextjs";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    SAVE_FILE_IN_CLOUD: z.string().transform((val) => val === "1"),
    DATABASE_URL: z.string().url(),
    HOST_NAME: z.string().url(),
    OPENAI_API_KEY: z.string().min(1),
    SUPABASE_API_URL: z.string().url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    SUPABASE_BUCKET: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1)
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
    SAVE_FILE_IN_CLOUD: process.env.SAVE_FILE_IN_CLOUD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_API_URL: process.env.SUPABASE_API_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_BUCKET: process.env.SUPABASE_BUCKET,
    HOST_NAME: process.env.HOST_NAME,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET
  }
});
