import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), description: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.list.create({
        data: {
          name: input.name,
          description: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Get both created lists and shared lists
    const lists = await ctx.db.list.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        OR: [
          { createdById: ctx.session.user.id },
          {
            sharedWith: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sharedWith: {
          select: {
            userId: true,
          },
        },
      },
    });

    return lists ?? [];
  }),

  shareLink: protectedProcedure
    .input(z.object({ listId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.list.findUnique({
        where: { id: input.listId },
      });

      if (!list) throw new Error("List not found");
      if (list.createdById !== ctx.session.user.id) {
        throw new Error("Not authorized to share this list");
      }

      if (!list.shareToken) {
        const token = nanoid(12);
        await ctx.db.list.update({
          where: { id: input.listId },
          data: { shareToken: token },
        });
        return token;
      }

      return list.shareToken;
    }),
});
