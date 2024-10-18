import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("token")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("userId", "bigint", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("token", "text", (col) => col.notNull())
    .addColumn("type", "varchar", (col) => col.notNull())
    .addColumn("expires_in", "bigint", (col) => col.notNull())
    .addColumn("status", "varchar", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("token").execute();
}
