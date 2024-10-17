ALTER TABLE "embedding" RENAME TO "embeddings";--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embedding_document_id_document_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
