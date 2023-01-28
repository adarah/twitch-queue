import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { getEbsToken } from "../../../utils/ebs";
import { broadcasterProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const queueRouter = createTRPCRouter({
    getByChannelId: protectedProcedure
        .query(({ ctx }) => {
            console.log('ctx.user', ctx.user);
            if (ctx.user == null) return null
            return ctx.prisma.queue.findUnique({
                where: { channelId: ctx.user.channelId }
            })
        }),
    upsert: broadcasterProcedure
        .input(z.object({ name: z.string(), rewardId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const q = await ctx.prisma.queue.upsert({
                create: {
                    name: input.name,
                    channelPointRewardId: input.rewardId,
                    channelId: ctx.user.channelId
                },
                update: {
                    name: input.name,
                    channelPointRewardId: input.rewardId,
                },
                where: {
                    channelId: ctx.user.channelId
                }
            });

            // Notify twitch the service has obtained the required configuration
            // https://dev.twitch.tv/docs/extensions/building/#creating-your-extension-backend-service-ebs
            const token = getEbsToken(ctx.user.id)
            console.log(token);
            const url = `https://api.twitch.tv/helix/extensions/required_configuration?broadcaster_id=${ctx.user.id}`
            const res = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    extension_id: env.TWITCH_EXTENSION_ID,
                    extension_version: env.TWITCH_EXTENSION_VERSION,
                    required_configuration: 'configV1' // update this when making breaking changes to the config
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Client-Id': env.TWITCH_EXTENSION_ID
                }
            })
            if (res.status !== 204) {
                throw Error(await res.text())
            }

            return q;
        })
})

