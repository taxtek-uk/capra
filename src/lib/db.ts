import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/** Tagged-template SQL only. Returns null when no URL is set, so the storefront still renders without a database. */
export const dbUrl = () => process.env.CAPRA_DATABASE_URL || process.env.DATABASE_URL || "";

type Sql = NeonQueryFunction<false, false>;
let checkDb: Sql | null = null;
/** Check scripts only: sends every db() call to a stand-in database (e.g. an in-memory Postgres). */
export const setCheckDb = (sql: Sql | null) => {
  checkDb = sql;
};

export function db() {
  if (checkDb) return checkDb;
  const url = dbUrl();
  return url ? neon(url) : null;
}
