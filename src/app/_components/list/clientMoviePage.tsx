"use client";

import { Flex, Grid, Text, Heading, Box, Tabs, Badge } from "@radix-ui/themes";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import MovieListCard from "~/app/_components/list/movieListCard";
import MovieSearch from "~/app/_components/list/movieSearch";
import type { MovieWithExtras } from "~/types/general";
import { api as apiReact } from "~/trpc/react";

export default function ClientMovieList({
  initialMovieData,
  slug,
  listId,
}: {
  initialMovieData: MovieWithExtras[];
  slug: string;
  listId: number;
}) {
  // Use React Query with initial data from server
  const { data: movieData } = apiReact.movie.getAll.useQuery(
    { listId },
    {
      initialData: initialMovieData,
      // This ensures the data stays fresh
      refetchOnMount: false,
      refetchOnWindowFocus: true,
    },
  );

  // Use the fresh data or fall back to initial
  const movies = movieData || initialMovieData;
  const pendingMovies = movies.filter((m) => m.status === "Pending");
  const watchingMovies = movies.filter((m) => m.status === "Watching");
  const watchedMovies = movies.filter((m) => m.status === "Watched");

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-1)" }}>
      <Flex
        direction="column"
        gap="4"
        px={{ initial: "4", md: "6" }}
        py="5"
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        {/* Header */}
        <Flex direction="row" gap="4" justify="between" align="center" mb="4">
          <Flex align="center" gap="3">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Flex
                align="center"
                gap="2"
                style={{
                  color: "var(--gray-11)",
                  transition: "color 0.2s",
                  cursor: "pointer",
                }}
                className="back-link"
              >
                <ArrowLeftIcon width="16" height="16" />
                <Text size="2" weight="medium">
                  Back to lists
                </Text>
              </Flex>
            </Link>
            <Text size="2" color="gray">
              •
            </Text>
            <Heading size="5" weight="bold">
              {decodeURIComponent(slug)}
            </Heading>
          </Flex>

          <Flex align="center" gap="3">
            <Badge size="2" variant="soft">
              {movies.length} movie{movies.length !== 1 ? "s" : ""}
            </Badge>
          </Flex>
        </Flex>

        {/* Search */}
        <Box mb="4">
          <MovieSearch listId={listId} />
        </Box>

        {/* Movies Grid with Tabs */}
        {movies.length > 0 ? (
          <Tabs.Root defaultValue="all">
            <Tabs.List size="2">
              <Tabs.Trigger value="all">All ({movies.length})</Tabs.Trigger>
              <Tabs.Trigger value="pending">
                Watchlist ({pendingMovies.length})
              </Tabs.Trigger>
              <Tabs.Trigger value="watching">
                Watching ({watchingMovies.length})
              </Tabs.Trigger>
              <Tabs.Trigger value="watched">
                Watched ({watchedMovies.length})
              </Tabs.Trigger>
            </Tabs.List>

            <Box mt="4">
              <Tabs.Content value="all">
                <Grid
                  columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
                  gap="4"
                >
                  {movies.map((movie) => (
                    <MovieListCard key={movie.id} movie={movie} />
                  ))}
                </Grid>
              </Tabs.Content>

              <Tabs.Content value="pending">
                {pendingMovies.length > 0 ? (
                  <Grid
                    columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
                    gap="4"
                  >
                    {pendingMovies.map((movie) => (
                      <MovieListCard key={movie.id} movie={movie} />
                    ))}
                  </Grid>
                ) : (
                  <EmptyState message="No movies in your watchlist yet" />
                )}
              </Tabs.Content>

              <Tabs.Content value="watching">
                {watchingMovies.length > 0 ? (
                  <Grid
                    columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
                    gap="4"
                  >
                    {watchingMovies.map((movie) => (
                      <MovieListCard key={movie.id} movie={movie} />
                    ))}
                  </Grid>
                ) : (
                  <EmptyState message="You're not currently watching any movies" />
                )}
              </Tabs.Content>

              <Tabs.Content value="watched">
                {watchedMovies.length > 0 ? (
                  <Grid
                    columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
                    gap="4"
                  >
                    {watchedMovies.map((movie) => (
                      <MovieListCard key={movie.id} movie={movie} />
                    ))}
                  </Grid>
                ) : (
                  <EmptyState message="You haven't marked any movies as watched yet" />
                )}
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        ) : (
          <EmptyState message="No movies in this list yet. Search for movies to add them!" />
        )}
      </Flex>

      <style jsx>{`
        .back-link:hover {
          color: var(--accent-11) !important;
        }
      `}</style>
    </Box>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "300px",
        backgroundColor: "var(--gray-2)",
        borderRadius: "12px",
        border: "2px dashed var(--gray-6)",
      }}
    >
      <Text size="3" color="gray">
        {message}
      </Text>
    </Flex>
  );
}
