CREATE TABLE IF NOT EXISTS "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255),
	"lyrics" text NOT NULL,
	"scroll_start_delay" integer DEFAULT 0 NOT NULL,
	"scroll_speed" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_songs_title" ON "songs" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_songs_author" ON "songs" ("author");