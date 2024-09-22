import { InferSelectModel, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const files = pgTable("file", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  fileName: varchar("filename", { length: 200 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`current_timestamp`),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`current_timestamp`)
});

export type File = InferSelectModel<typeof files>;
