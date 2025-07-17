"use client";

import {
  Card,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  DropdownMenu,
  Callout,
} from "@radix-ui/themes";
import { formatDate } from "~/utils/helpers";
import Rating from "../dashboard/rating";
import type { Movie } from "~/types/general";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

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

  const [feedback, setFeedback] = useState<{
    message: string;
    variant: "surface" | "soft" | "outline";
    color: "green" | "red";
  } | null>(null);

  const showMessage = (message: string, type: "success" | "error") => {
    setFeedback({
      message,
      variant: "soft",
      color: type === "success" ? "green" : "red",
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  const addToList = api.movie.addToList.useMutation({
    onSuccess: async () => {
      showMessage("Movie added to list", "success");
      await utils.movie.getAll.invalidate();
    },
    onError: () => showMessage("Failed to add movie", "error"),
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

  return (
    <Card
      key={movie.id}
      size="2"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        style={{
          width: "100%",
          height: "320px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          style={{
            objectFit: "cover",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        />
        <Rating rating={movie.vote_average} />
      </Box>

      <Flex
        direction="column"
        justify="between"
        style={{ flexGrow: 1, padding: "1rem" }}
      >
        <Box>
          <Heading size="3">{movie.title}</Heading>
          <Text size="1" color="gray">
            Release date: {formatDate(movie.release_date)}
          </Text>
          <Text
            size="2"
            mt="2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.overview}
          </Text>
        </Box>

        <Flex gap="2" align="center" wrap="wrap" mt="3">
          <Text size="1" color="gray">
            Genres:
          </Text>
          {movie.genre_ids && movie.genre_ids.length > 0 ? (
            movie.genre_ids.map((id) => (
              <Text key={id} size="1" weight="medium" color="plum">
                {genreMap[id] ?? "Unknown"}
              </Text>
            ))
          ) : (
            <Text size="1" color="gray">
              None
            </Text>
          )}
        </Flex>
      </Flex>

      <Flex justify="between" p="3">
        <Button
          variant="soft"
          onClick={() =>
            addToList.mutate({ ...basePayload, status: "Pending" })
          }
        >
          Add to Pending
        </Button>
        <Button
          variant="soft"
          onClick={() =>
            addToList.mutate({ ...basePayload, status: "Watched" })
          }
        >
          Add to Watched
        </Button>
      </Flex>
      {feedback && (
        <Callout.Root
          color={feedback.color}
          variant={feedback.variant}
          role="status"
        >
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{feedback.message}</Callout.Text>
        </Callout.Root>
      )}
    </Card>
  );
}
