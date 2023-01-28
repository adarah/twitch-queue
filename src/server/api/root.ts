import { exampleRouter } from "./routers/example";
import { queueRouter } from "./routers/queue";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  queue: queueRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
