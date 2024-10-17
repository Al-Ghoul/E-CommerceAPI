import { defineConfig } from "kysely-ctl";
import database from "better-sqlite3";

export default defineConfig({
  dialect: "better-sqlite3",
  migrations: {
    migrationFolder: "migrations",
  },
  dialectConfig: {
    database: database("./example.db"),
  },
});
