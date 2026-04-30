// Modified from upstream (delmaredigital/dd-starter):
//   - Import switched from @payloadcms/db-vercel-postgres → db-postgres (our adapter).
//   - `IF NOT EXISTS` added to the 4× `ADD VALUE 'edit-url'` statements for idempotency
//     on envs that previously ran our (now-removed) 20260416_015924 — which added the
//     same enum values 8 days before upstream caught up. Down() left as upstream.
//     See AGENTS.md → "Migrations on this fork".
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_posts_slug_history_reason" ADD VALUE IF NOT EXISTS 'edit-url';
  ALTER TYPE "public"."enum__posts_v_version_slug_history_reason" ADD VALUE IF NOT EXISTS 'edit-url';
  ALTER TYPE "public"."enum_pages_slug_history_reason" ADD VALUE IF NOT EXISTS 'edit-url';
  ALTER TYPE "public"."enum__pages_v_version_slug_history_reason" ADD VALUE IF NOT EXISTS 'edit-url';
  ALTER TABLE "two_factors" ADD COLUMN "verified" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_slug_history" ALTER COLUMN "reason" SET DATA TYPE text;
  DROP TYPE "public"."enum_posts_slug_history_reason";
  CREATE TYPE "public"."enum_posts_slug_history_reason" AS ENUM('move', 'rename', 'regenerate', 'restore', 'manual');
  ALTER TABLE "posts_slug_history" ALTER COLUMN "reason" SET DATA TYPE "public"."enum_posts_slug_history_reason" USING "reason"::"public"."enum_posts_slug_history_reason";
  ALTER TABLE "_posts_v_version_slug_history" ALTER COLUMN "reason" SET DATA TYPE text;
  DROP TYPE "public"."enum__posts_v_version_slug_history_reason";
  CREATE TYPE "public"."enum__posts_v_version_slug_history_reason" AS ENUM('move', 'rename', 'regenerate', 'restore', 'manual');
  ALTER TABLE "_posts_v_version_slug_history" ALTER COLUMN "reason" SET DATA TYPE "public"."enum__posts_v_version_slug_history_reason" USING "reason"::"public"."enum__posts_v_version_slug_history_reason";
  ALTER TABLE "pages_slug_history" ALTER COLUMN "reason" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_slug_history_reason";
  CREATE TYPE "public"."enum_pages_slug_history_reason" AS ENUM('move', 'rename', 'regenerate', 'restore', 'manual');
  ALTER TABLE "pages_slug_history" ALTER COLUMN "reason" SET DATA TYPE "public"."enum_pages_slug_history_reason" USING "reason"::"public"."enum_pages_slug_history_reason";
  ALTER TABLE "_pages_v_version_slug_history" ALTER COLUMN "reason" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_version_slug_history_reason";
  CREATE TYPE "public"."enum__pages_v_version_slug_history_reason" AS ENUM('move', 'rename', 'regenerate', 'restore', 'manual');
  ALTER TABLE "_pages_v_version_slug_history" ALTER COLUMN "reason" SET DATA TYPE "public"."enum__pages_v_version_slug_history_reason" USING "reason"::"public"."enum__pages_v_version_slug_history_reason";
  ALTER TABLE "two_factors" DROP COLUMN "verified";`)
}
