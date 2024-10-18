import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "kysely-codegen";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: 5433,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
