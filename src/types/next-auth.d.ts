import { type DefaultSession, type DefaultUser } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: User
  }

  interface User {
    id: string
    role: 'broadcaster' | 'moderator' | 'viewer' | 'external'
    channelId: string
    pubsubPerms: unknown
  }

}

declare module "next-auth/jwt" {

  interface JWT extends DefaultJWT {
    user: User
  }
}