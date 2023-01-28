import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import jwt from 'jsonwebtoken';
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    jwt({token, user}) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 86400
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: "Twitch Extension Token",
      credentials: {
        token: { label: 'JWT', type: 'password' }
      },
      async authorize(credentials, req) {
        if (credentials === undefined) return null;
        const payload = jwt.verify(credentials.token, Buffer.from(env.TWITCH_EXTENSION_SECRET, 'base64'));
        if (typeof payload === 'string') return null;
        return {
          id: payload.user_id,
          channelId: payload.channel_id,
          role: payload.role,
          pubsubPerms: payload.pubsub_perms,
        }
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
