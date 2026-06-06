import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

export function createDb(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to create a PostgreSQL client.");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema });
}

export type DbClient = ReturnType<typeof createDb>;
