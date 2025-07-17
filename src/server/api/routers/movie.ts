import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const movieRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ listId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.listMovie.findMany({
        where: { listId: input.listId },
        include: {
          movie: true,
          addedBy: true,
          ratings: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  addToList: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        movieId: z.number(),
        title: z.string(),
        tmdbId: z.number(),
        genres: z.array(z.string()),
        posterPath: z.string().optional(),
        releaseDate: z.string().optional(),
        overview: z.string().optional(),
        status: z.enum(["Pending", "Watched"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listMovie.upsert({
        where: {
          listId_movieId: {
            listId: input.listId,
            movieId: input.movieId,
          },
        },
        update: {
          status: input.status,
        },
        create: {
          list: { connect: { id: input.listId } },
          movie: {
            connectOrCreate: {
              where: { id: input.movieId },
              create: {
                id: input.movieId,
                title: input.title,
                overview: input.overview,
                releaseDate: input.releaseDate
                  ? new Date(input.releaseDate)
                  : undefined,
                posterPath: input.posterPath,
                genres: input.genres,
                tmdbId: input.tmdbId,
              },
            },
          },
          addedBy: { connect: { id: ctx.session.user.id } },
          status: input.status,
        },
      });
    }),

  removeFromList: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        movieId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listMovie.deleteMany({
        where: {
          listId: input.listId,
          movieId: input.movieId,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        movieId: z.number(),
        status: z.enum(["Pending", "Watched"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listMovie.updateMany({
        where: {
          listId: input.listId,
          movieId: input.movieId,
        },
        data: {
          status: input.status,
        },
      });
    }),

  rateMovie: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        movieId: z.number(),
        rating: z.number().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Step 1: Find the corresponding ListMovie entry
      const listMovie = await ctx.db.listMovie.findUnique({
        where: {
          listId_movieId: {
            listId: input.listId,
            movieId: input.movieId,
          },
        },
      });

      if (!listMovie) {
        throw new Error("Movie is not in this list.");
      }

      // Step 2: Upsert MovieRating using listMovieId + userId
      return ctx.db.movieRating.upsert({
        where: {
          listMovieId_userId: {
            listMovieId: listMovie.id,
            userId: ctx.session.user.id,
          },
        },
        update: {
          rating: input.rating,
        },
        create: {
          listMovieId: listMovie.id,
          userId: ctx.session.user.id,
          rating: input.rating,
        },
      });
    }),
});
