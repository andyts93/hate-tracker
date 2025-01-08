import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import RedditProvider from "next-auth/providers/reddit";
import DiscordProvider from "next-auth/providers/discord";
import { Pool } from "@neondatabase/serverless";
import PostgresAdapter from "@auth/pg-adapter";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    RedditProvider({
      clientId: process.env.AUTH_REDDIT_ID || "",
      clientSecret: process.env.AUTH_REDDIT_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID || "",
      clientSecret: process.env.AUTH_DISCORD_SECRET || "",
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
