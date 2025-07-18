"use client";

import {
  Card,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
} from "@radix-ui/themes";
import { formatDate } from "~/utils/helpers";
import Rating from "../dashboard/rating";
import type { Movie } from "~/types/general";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  CheckIcon,
  PlusIcon,
  ClockIcon,
  PlayIcon,
} from "@radix-ui/react-icons";

export default function MovieCard({
  movie,
  genreMap,
  listId,
}: {
  movie: Movie;
  genreMap: Record<number, string>;
  listId: number;
}) {
  const utils = api.useUtils();

  const [isLoading, setIsLoading] = useState(false);
  const [addedStatus, setAddedStatus] = useState<string | null>(null);

  const addToList = api.movie.addToList.useMutation({
    onMutate: async () => {
      setIsLoading(true);
    },
    onSuccess: async (data, variables) => {
      setAddedStatus(variables.status);
      await utils.movie.getAll.invalidate({ listId });

      // Clear the success message after 2 seconds
      setTimeout(() => {
        setAddedStatus(null);
      }, 2000);
    },
    onError: () => {
      setAddedStatus(null);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const basePayload = {
    listId,
    movieId: movie.id,
    title: movie.title,
    tmdbId: movie.id,
    genres: movie.genre_ids?.map((id) => genreMap[id] ?? "Unknown") ?? [],
    posterPath: movie.poster_path ?? undefined,
    releaseDate: movie.release_date ?? undefined,
    overview: movie.overview ?? undefined,
  };

  const handleAddToList = (status: "Pending" | "Watching" | "Watched") => {
    if (!isLoading) {
      addToList.mutate({ ...basePayload, status });
    }
  };

  return (
    <Card
      size="2"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition: "all 0.2s ease",
        border: "1px solid var(--gray-5)",
      }}
      className="movie-card"
    >
      {/* Poster Section */}
      <Box
        style={{
          width: "100%",
          height: "320px",
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "var(--gray-3)",
            }}
          >
            <Text color="gray">No poster available</Text>
          </Flex>
        )}
        <Rating rating={movie.vote_average} />

        {/* Success overlay */}
        {addedStatus && (
          <Flex
            align="center"
            justify="center"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(4px)",
              zIndex: 10,
            }}
          >
            <Box style={{ textAlign: "center" }}>
              <CheckIcon width="48" height="48" color="var(--green-9)" />
              <Text
                size="3"
                weight="medium"
                style={{ display: "block", marginTop: "8px", color: "white" }}
              >
                Added to {addedStatus}
              </Text>
            </Box>
          </Flex>
        )}
      </Box>

      {/* Content Section */}
      <Flex
        direction="column"
        justify="between"
        style={{ flexGrow: 1, padding: "16px" }}
      >
        <Box>
          <Heading size="3" mb="1" style={{ lineHeight: 1.2 }}>
            {movie.title}
          </Heading>
          <Text size="1" color="gray">
            {formatDate(movie.release_date)}
          </Text>

          {/* Genres */}
          <Flex gap="1" wrap="wrap" mt="2" mb="3">
            {movie.genre_ids && movie.genre_ids.length > 0 ? (
              movie.genre_ids.slice(0, 3).map((id) => (
                <Badge key={id} size="1" variant="soft" radius="full">
                  {genreMap[id] ?? "Unknown"}
                </Badge>
              ))
            ) : (
              <Text size="1" color="gray">
                No genres
              </Text>
            )}
          </Flex>

          {/* Overview */}
          <Text
            size="2"
            color="gray"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.5,
            }}
          >
            {movie.overview || "No description available."}
          </Text>
        </Box>

        {/* Action Buttons */}
        <Flex gap="2" mt="4" direction="column">
          <Flex gap="2">
            <Button
              variant="soft"
              style={{ flex: 1 }}
              disabled={isLoading}
              onClick={() => handleAddToList("Pending")}
            >
              <ClockIcon width="16" height="16" />
              Watchlist
            </Button>
            <Button
              variant="soft"
              color="blue"
              style={{ flex: 1 }}
              disabled={isLoading}
              onClick={() => handleAddToList("Watching")}
            >
              <PlayIcon width="16" height="16" />
              Watching
            </Button>
          </Flex>
          <Button
            variant="solid"
            style={{ width: "100%" }}
            disabled={isLoading}
            onClick={() => handleAddToList("Watched")}
          >
            <CheckIcon width="16" height="16" />
            Watched
          </Button>
        </Flex>
      </Flex>

      <style jsx>{`
        .movie-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: var(--accent-8);
        }
      `}</style>
    </Card>
  );
}
