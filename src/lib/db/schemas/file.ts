import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const files = pgTable("file", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  fileName: varchar("filename", { length: 200 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull()
});
