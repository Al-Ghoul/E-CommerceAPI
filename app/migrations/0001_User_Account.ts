import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "bigserial", (col) => col.primaryKey())
    .addColumn("email", "varchar(50)", (col) => col.unique())
    .addColumn("first_name", "varchar(50)")
    .addColumn("last_name", "varchar(50)")
    .addColumn("emailVerified", "timestamp")
    .addColumn("image", "varchar(255)")
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
    .addColumn("password", "varchar(255)")
    .addColumn("user_id", "bigint", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("type", "varchar(50)", (col) => col.notNull())
    .addColumn("provider", "varchar(50)", (col) => col.notNull())
    .addColumn("providerAccount_id", "varchar(50)", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("id_token", "text")
    .addColumn("expires_in", "bigint")
    .addColumn("scope", "varchar(255)")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex("Account_user_id_index")
    .on("account")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("Account_user_id_index").execute();
  await db.schema.dropTable("account").execute();
  await db.schema.dropTable("user").execute();
}
