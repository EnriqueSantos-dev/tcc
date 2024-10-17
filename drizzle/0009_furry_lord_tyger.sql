ALTER TABLE "user" RENAME COLUMN "email_verified" TO "is_email_verified";--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_document_id_document_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hash" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
