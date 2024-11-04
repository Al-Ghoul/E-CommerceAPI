import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: "pg",
  migrations: {
    migrationFolder: "migrations",
  },
  dialectConfig: {
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  },
  seeds: {
    seedFolder: "seeds",
  },
});
