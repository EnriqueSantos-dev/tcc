import { env } from "@/lib/env.mjs";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schemas",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
