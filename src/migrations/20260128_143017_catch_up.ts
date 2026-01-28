import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_slug_history_reason" AS ENUM('move', 'rename', 'regenerate', 'restore', 'manual');
  CREATE TYPE "public"."enum__pages_v_version_slug_history_reason" AS ENUM('move', 'rename', 'regenerate', 'restore', 'manual');
  ALTER TYPE "public"."enum_payload_folders_folder_type" ADD VALUE 'pages';
  CREATE TABLE "pages_slug_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"changed_at" timestamp(3) with time zone,
  	"reason" "enum_pages_slug_history_reason"
  );
  
  CREATE TABLE "_pages_v_version_slug_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"changed_at" timestamp(3) with time zone,
  	"reason" "enum__pages_v_version_slug_history_reason",
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "page_segment" varchar;
  ALTER TABLE "pages" ADD COLUMN "sort_order" numeric DEFAULT 0;
  ALTER TABLE "pages" ADD COLUMN "folder_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_page_segment" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_sort_order" numeric DEFAULT 0;
  ALTER TABLE "_pages_v" ADD COLUMN "version_folder_id" integer;
  ALTER TABLE "pages_slug_history" ADD CONSTRAINT "pages_slug_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_slug_history" ADD CONSTRAINT "_pages_v_version_slug_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_slug_history_order_idx" ON "pages_slug_history" USING btree ("_order");
  CREATE INDEX "pages_slug_history_parent_id_idx" ON "pages_slug_history" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_slug_history_order_idx" ON "_pages_v_version_slug_history" USING btree ("_order");
  CREATE INDEX "_pages_v_version_slug_history_parent_id_idx" ON "_pages_v_version_slug_history" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_folder_idx" ON "pages" USING btree ("folder_id");
  CREATE INDEX "_pages_v_version_version_folder_idx" ON "_pages_v" USING btree ("version_folder_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_slug_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_slug_history" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_slug_history" CASCADE;
  DROP TABLE "_pages_v_version_slug_history" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "payload_folders_folder_type" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_folders_folder_type";
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('posts', 'media');
  ALTER TABLE "payload_folders_folder_type" ALTER COLUMN "value" SET DATA TYPE "public"."enum_payload_folders_folder_type" USING "value"::"public"."enum_payload_folders_folder_type";
  DROP INDEX "pages_folder_idx";
  DROP INDEX "_pages_v_version_version_folder_idx";
  ALTER TABLE "pages" DROP COLUMN "page_segment";
  ALTER TABLE "pages" DROP COLUMN "sort_order";
  ALTER TABLE "pages" DROP COLUMN "folder_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_page_segment";
  ALTER TABLE "_pages_v" DROP COLUMN "version_sort_order";
  ALTER TABLE "_pages_v" DROP COLUMN "version_folder_id";
  DROP TYPE "public"."enum_pages_slug_history_reason";
  DROP TYPE "public"."enum__pages_v_version_slug_history_reason";`)
}
