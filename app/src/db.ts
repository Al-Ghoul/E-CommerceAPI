import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { DB } from "kysely-codegen";

const dialect = new SqliteDialect({
  database: new SQLite("example.db"),
});

export const db = new Kysely<DB>({
  dialect,
});
