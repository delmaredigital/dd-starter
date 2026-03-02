import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "apikeys" RENAME COLUMN "user_id" TO "reference_id";
  ALTER TABLE "apikeys" DROP CONSTRAINT "apikeys_user_id_users_id_fk";
  
  DROP INDEX "apikeys_user_idx";
  ALTER TABLE "apikeys" ADD COLUMN "config_id" varchar DEFAULT 'default' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "apikeys" RENAME COLUMN "reference_id" TO "user_id";
  ALTER TABLE "apikeys" ADD CONSTRAINT "apikeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "apikeys_user_idx" ON "apikeys" USING btree ("user_id");
  ALTER TABLE "apikeys" DROP COLUMN "config_id";`)
}
