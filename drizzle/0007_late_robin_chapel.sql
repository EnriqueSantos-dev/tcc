CREATE TABLE IF NOT EXISTS "embedding" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"metadata" jsonb,
	"embedding" vector(1536) NOT NULL,
	"document_id" text NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "embeddingIndex";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embedding" ADD CONSTRAINT "embedding_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "embedding" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "document" DROP COLUMN IF EXISTS "content";--> statement-breakpoint
ALTER TABLE "document" DROP COLUMN IF EXISTS "metadata";--> statement-breakpoint
ALTER TABLE "document" DROP COLUMN IF EXISTS "embedding";