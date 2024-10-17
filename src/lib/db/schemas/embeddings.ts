import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  vector
} from "drizzle-orm/pg-core";
import { documents } from "./documents";

export const embeddings = pgTable(
  "embeddings",
  {
    id: serial("id").primaryKey(),
    content: text("content"),
    metadata: jsonb("metadata"),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade"
      })
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    )
  })
);
