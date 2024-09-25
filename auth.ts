import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

  return {
    adapter: PostgresAdapter(pool),
    providers: [Google],
  };
});
