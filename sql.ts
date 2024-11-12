import { neon } from "@neondatabase/serverless";

import { cache } from "./cache";

export const sql = neon(process.env.DATABASE_URL || "");

export const sqlCache = async (
  key: string,
  query: string,
  ttl: number = 60 * 60 * 1000,
): Promise<any> => {
  return await cache.wrap(
    key,
    async () => {
      return await sql(query);
    },
    ttl,
  );
};
