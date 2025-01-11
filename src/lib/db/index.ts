import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env.mjs";
import * as schema from "./schemas";
import { Logger } from "drizzle-orm";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema>;
}

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

let db: PostgresJsDatabase<typeof schema>;

if (env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL, { prepare: false }), {
    schema,
    logger: new MyLogger()
  });
} else {
  if (!global.db)
    global.db = drizzle(postgres(env.DATABASE_URL, { prepare: false }), {
      schema,
      logger: new MyLogger()
    });

  db = global.db;
}

export { db };
