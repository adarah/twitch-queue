import jwt from 'jsonwebtoken';
import { type GetServerSidePropsContext } from "next";
import { unstable_getServerSession, User } from "next-auth";

import { env } from "../env/server.mjs";
import { authOptions } from "../pages/api/auth/[...nextauth]";

/**
 * Wrapper for unstable_getServerSession, used in trpc createContext and the
 * restricted API route
 *
 * Don't worry too much about the "unstable", it's safe to use but the syntax
 * may change in future versions
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};


export function getUserFromAuthHeader(req: GetServerSidePropsContext['req']): User | null {
  const auth = req.headers['authorization']
  if (auth === undefined) return null;
  try {
    const payload = jwt.verify(auth, Buffer.from(env.TWITCH_EXTENSION_SECRET, 'base64'))
    if (typeof payload === 'string') return null;
    return {
      id: payload.user_id,
      channelId: payload.channel_id,
      role: payload.role,
      pubsubPerms: payload.pubsub_perms,
    }
  } catch {
  return null;
}
}