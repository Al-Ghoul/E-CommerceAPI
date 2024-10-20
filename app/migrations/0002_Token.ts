import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("token_type")
    .asEnum(["access", "refresh"])
    .execute();
  await db.schema
    .createType("token_status")
    .asEnum(["valid", "invalid", "revoked"])
    .execute();

  await db.schema
    .createTable("token")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("user_id", "bigint", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("token", "text", (col) => col.notNull())
    .addColumn("type", sql`token_type`)
    .addColumn("expires_in", "bigint", (col) => col.notNull())
    .addColumn("status", sql`token_status`)
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("token").execute();
  await db.schema.dropType("token_type").execute();
  await db.schema.dropType("token_status").execute();
}
