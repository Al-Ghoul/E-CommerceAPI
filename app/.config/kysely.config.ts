import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: "pg",
  migrations: {
    migrationFolder: "migrations",
  },
  dialectConfig: {
    pool: new Pool({
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: 5433,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      max: 10,
    }),
  },
});
