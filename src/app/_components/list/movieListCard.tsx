"use client";
import {
  Popover,
  Card,
  Inset,
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Callout,
  TextField,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/trpc/react";
import { formatDate } from "~/utils/helpers";
import { useSession } from "next-auth/react";
import type { MovieWithExtras } from "~/types/general";

export default function MovieListCard({ movie }: { movie: MovieWithExtras }) {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [message, setMessage] = useState<string | null>(null);

  const [userRating, setUserRating] = useState<number | "">(getInitialRating());

  function getInitialRating() {
    const me = movie.ratings.find((r) => r.userId === session?.user.id);
    return me?.rating ?? "";
  }

  const updateStatus = api.movie.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.movie.getAll.invalidate();
      setMessage("Status updated.");
    },
  });

  const removeFromList = api.movie.removeFromList.useMutation({
    onSuccess: async () => {
      await utils.movie.getAll.invalidate();
      setMessage("Movie removed.");
    },
  });

  const rateMovie = api.movie.rateMovie.useMutation({
    onSuccess: async () => {
      await utils.movie.getAll.invalidate();
      setMessage("Rating saved.");
    },
  });

  const handleToggleStatus = () => {
    updateStatus.mutate({
      listId: movie.listId,
      movieId: movie.movie.id,
      status: movie.status === "Watched" ? "Pending" : "Watched",
    });
  };

  const handleDelete = () => {
    removeFromList.mutate({
      listId: movie.listId,
      movieId: movie.movie.id,
    });
  };

  const handleRate = () => {
    if (!userRating || typeof userRating !== "number") return;
    rateMovie.mutate({
      listId: movie.listId,
      movieId: movie.movie.id,
      rating: userRating,
    });
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Card size="2" style={{ cursor: "pointer" }}>
          <Inset clip="padding-box" side="top" pb="current">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.movie.posterPath}`}
              alt={movie.movie.title}
              width={500}
              height={300}
              style={{ objectFit: "cover", width: "100%", height: 160 }}
            />
          </Inset>
          <Box p="3">
            <Heading size="3" mb="1">
              {movie.movie.title}
            </Heading>
            <Text size="1" color="gray">
              Added by: {movie.addedBy?.name ?? "Unknown"}
            </Text>
            <Text size="1" color="gray">
              Status: {movie.status || "Pending"}
            </Text>
          </Box>
        </Card>
      </Popover.Trigger>
      <Popover.Content style={{ maxWidth: 320 }}>
        <Heading size="4" mb="2">
          {movie.movie.title}
        </Heading>
        <Text size="2">{movie.movie.overview ?? "No description."}</Text>
        <Box mt="2">
          <Text size="1" color="gray">
            Release date:{" "}
            {(movie.movie.releaseDate
              ? formatDate(movie.movie.releaseDate.toISOString?.())
              : null) ?? "Unknown"}
          </Text>
        </Box>
        <Box mt="2">
          <Text size="1">Added by: {movie.addedBy?.name ?? "Unknown"}</Text>
          <Text size="1">Status: {movie.status || "Pending"}</Text>

          <Text size="1" mt="2">
            Ratings:
          </Text>
          <Flex direction="column" gap="1">
            {movie.ratings?.length > 0 ? (
              movie.ratings.map((r) => (
                <Text size="1" key={r.userId}>
                  {r.user.name}: {r.rating}/10
                </Text>
              ))
            ) : (
              <Text size="1" color="gray">
                No ratings yet
              </Text>
            )}
          </Flex>
        </Box>

        <Box mt="2">
          <Text size="1">Your rating:</Text>
          <Flex gap="2" align="center" mt="1">
            <TextField.Root
              value={userRating}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setUserRating(
                  Number.isNaN(val) ? "" : Math.min(Math.max(val, 1), 10),
                );
              }}
              placeholder="1–10"
              style={{ width: "60px" }}
            />
            <Button onClick={handleRate} size="1">
              Save
            </Button>
          </Flex>
        </Box>

        <Flex mt="3" gap="2" wrap="wrap">
          <Button size="1" onClick={handleToggleStatus}>
            Mark as {movie.status === "Watched" ? "Pending" : "Watched"}
          </Button>
          <Button size="1" color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Flex>

        {message && (
          <Callout.Root mt="3" color="green" variant="soft">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{message}</Callout.Text>
          </Callout.Root>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}
