import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("email", "text", (col) => col.unique())
    .addColumn("first_name", "text")
    .addColumn("last_name", "text")
    .addColumn("emailVerified", "timestamptz")
    .addColumn("image", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("password", "varchar")
    .addColumn("userId", "bigint", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("id_token", "text")
    .addColumn("expires_in", "bigint")
    .addColumn("scope", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex("Account_userId_index")
    .on("account")
    .column("userId")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("account").execute();
  await db.schema.dropTable("user").execute();
}
