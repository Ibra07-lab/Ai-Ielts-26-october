import { SQLDatabase } from "encore.dev/storage/sqldb";

export const ieltsDB = new SQLDatabase("ielts", {
  migrations: "./migrations",
});
