CREATE TABLE IF NOT EXISTS "file" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"filename" varchar(200) NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "file_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
