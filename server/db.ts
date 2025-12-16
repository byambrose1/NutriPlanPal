import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use individual PG environment variables for more reliable connection
const connectionConfig = {
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGHOST?.includes('neon') || process.env.PGHOST?.includes('supabase') 
    ? { rejectUnauthorized: false } 
    : undefined,
};

if (!connectionConfig.host || !connectionConfig.database) {
  throw new Error(
    "Database connection not configured. Please provision a database.",
  );
}

export const pool = new Pool(connectionConfig);
export const db = drizzle(pool, { schema });
