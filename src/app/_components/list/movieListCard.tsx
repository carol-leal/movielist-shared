"use client";
import {
  Card,
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Badge,
  TextField,
  Dialog,
  Avatar,
} from "@radix-ui/themes";
import {
  TrashIcon,
  CheckIcon,
  ClockIcon,
  StarIcon,
  StarFilledIcon,
  PersonIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/trpc/react";
import { formatDate } from "~/utils/helpers";
import { useSession } from "next-auth/react";
import type { MovieWithExtras } from "~/types/general";

export default function MovieListCard({ movie }: { movie: MovieWithExtras }) {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [userRating, setUserRating] = useState<number | "">(getInitialRating());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function getInitialRating() {
    const me = movie.ratings.find((r) => r.userId === session?.user.id);
    return me?.rating ?? "";
  }

  const updateStatus = api.movie.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.movie.getAll.invalidate({ listId: movie.listId });
    },
  });

  const removeFromList = api.movie.removeFromList.useMutation({
    onSuccess: async () => {
      await utils.movie.getAll.invalidate({ listId: movie.listId });
      setShowDeleteDialog(false);
    },
  });

  const rateMovie = api.movie.rateMovie.useMutation({
    onSuccess: async () => {
      await utils.movie.getAll.invalidate({ listId: movie.listId });
      setShowRatingDialog(false);
    },
  });

  const handleUpdateStatus = (
    newStatus: "Pending" | "Watching" | "Watched",
  ) => {
    updateStatus.mutate({
      listId: movie.listId,
      movieId: movie.movie.id,
      status: newStatus,
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

  const userHasRated = movie.ratings.find((r) => r.userId === session?.user.id);
  const averageRating =
    movie.ratings.length > 0
      ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
        movie.ratings.length
      : 0;

  return (
    <>
      <Card
        size="2"
        style={{
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease",
          border: "1px solid var(--gray-5)",
        }}
        className="movie-list-card"
      >
        {/* Poster */}
        <Box style={{ position: "relative", height: "240px", flexShrink: 0 }}>
          {movie.movie.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.movie.posterPath}`}
              alt={movie.movie.title}
              fill
              style={{ objectFit: "cover" }}
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
              <Text color="gray">No poster</Text>
            </Flex>
          )}

          {/* Gradient overlay for badge visibility */}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "80px",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Status Badge */}
          <Badge
            color={
              movie.status === "Watched"
                ? "green"
                : movie.status === "Watching"
                  ? "blue"
                  : "orange"
            }
            size="2"
            variant="solid"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor:
                movie.status === "Watched"
                  ? "var(--green-9)"
                  : movie.status === "Watching"
                    ? "var(--blue-9)"
                    : "var(--orange-9)",
              color: "white",
              fontWeight: "600",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {movie.status === "Watched" ? (
              <CheckIcon width="12" height="12" />
            ) : movie.status === "Watching" ? (
              <PlayIcon width="12" height="12" />
            ) : (
              <ClockIcon width="12" height="12" />
            )}
            {movie.status}
          </Badge>
        </Box>

        {/* Content */}
        <Flex direction="column" p="3" style={{ flexGrow: 1 }} gap="2">
          <Heading size="2" style={{ lineHeight: 1.2 }}>
            {movie.movie.title}
          </Heading>

          {/* Added by */}
          <Flex align="center" gap="1">
            <PersonIcon width="14" height="14" color="var(--gray-9)" />
            <Text size="1" color="gray">
              Added by {movie.addedBy?.name ?? "Unknown"}
            </Text>
          </Flex>

          {/* Release Date */}
          {movie.movie.releaseDate && (
            <Text size="1" color="gray">
              {new Date(movie.movie.releaseDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          )}

          {/* Ratings Section */}
          <Box
            style={{
              backgroundColor: "var(--gray-2)",
              borderRadius: "6px",
              padding: "6px 8px",
              marginTop: "auto",
            }}
          >
            <Flex justify="between" align="center" mb="1">
              <Text size="1" weight="medium">
                Ratings
              </Text>
              {averageRating > 0 && (
                <Flex align="center" gap="1">
                  <StarFilledIcon
                    width="12"
                    height="12"
                    color="var(--amber-9)"
                  />
                  <Text size="1" weight="medium">
                    {averageRating.toFixed(1)}
                  </Text>
                </Flex>
              )}
            </Flex>

            {movie.ratings?.length > 0 ? (
              <Flex direction="column" gap="1">
                {movie.ratings.slice(0, 2).map((r) => (
                  <Flex key={r.userId} justify="between" align="center">
                    <Text size="1" style={{ fontSize: "11px" }}>
                      {r.user?.name ?? "Unknown"}
                    </Text>
                    <Flex align="center" gap="1">
                      <StarIcon width="10" height="10" />
                      <Text
                        size="1"
                        weight="medium"
                        style={{ fontSize: "11px" }}
                      >
                        {r.rating}/10
                      </Text>
                    </Flex>
                  </Flex>
                ))}
                {movie.ratings.length > 2 && (
                  <Text size="1" color="gray" style={{ fontSize: "11px" }}>
                    +{movie.ratings.length - 2} more
                  </Text>
                )}
              </Flex>
            ) : (
              <Text size="1" color="gray" style={{ fontSize: "11px" }}>
                No ratings yet
              </Text>
            )}
          </Box>

          {/* Actions */}
          <Flex direction="column" gap="1" mt="2">
            <Flex gap="1" wrap="wrap">
              <Button
                size="1"
                variant="soft"
                style={{ flex: "1 1 auto", minWidth: "60px", fontSize: "12px" }}
                onClick={() => setShowRatingDialog(true)}
              >
                <StarIcon width="12" height="12" />
                {userHasRated ? "Edit" : "Rate"}
              </Button>
              <Button
                size="1"
                variant="soft"
                color="red"
                style={{ padding: "0 8px" }}
                onClick={() => setShowDeleteDialog(true)}
              >
                <TrashIcon width="12" height="12" />
              </Button>
            </Flex>

            {/* Status buttons */}
            <Flex gap="1" wrap="wrap">
              <Button
                size="1"
                variant={movie.status === "Pending" ? "solid" : "soft"}
                color="orange"
                style={{ flex: "1 1 auto", minWidth: "70px", fontSize: "11px" }}
                onClick={() => handleUpdateStatus("Pending")}
                disabled={updateStatus.isPending || movie.status === "Pending"}
              >
                <ClockIcon width="12" height="12" />
                Pending
              </Button>
              <Button
                size="1"
                variant={movie.status === "Watching" ? "solid" : "soft"}
                color="blue"
                style={{ flex: "1 1 auto", minWidth: "70px", fontSize: "11px" }}
                onClick={() => handleUpdateStatus("Watching")}
                disabled={updateStatus.isPending || movie.status === "Watching"}
              >
                <PlayIcon width="12" height="12" />
                Watching
              </Button>
              <Button
                size="1"
                variant={movie.status === "Watched" ? "solid" : "soft"}
                color="green"
                style={{ flex: "1 1 auto", minWidth: "70px", fontSize: "11px" }}
                onClick={() => handleUpdateStatus("Watched")}
                disabled={updateStatus.isPending || movie.status === "Watched"}
              >
                <CheckIcon width="12" height="12" />
                Watched
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {/* Rating Dialog */}
      <Dialog.Root open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Rate {movie.movie.title}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {movie.movie.overview ?? "No description available."}
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="2" mb="1" weight="medium">
                Your Rating
              </Text>
              <TextField.Root
                value={userRating}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input === "") {
                    setUserRating("");
                    return;
                  }
                  const val = parseFloat(input);
                  if (!Number.isNaN(val) && val >= 0 && val <= 10) {
                    setUserRating(val);
                  }
                }}
                placeholder="0-10"
                type="number"
                step="0.1"
                min="0"
                max="10"
              />
            </Box>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleRate}
              disabled={!userRating || rateMovie.isPending}
            >
              Save Rating
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Remove from list?</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to remove &quot;{movie.movie.title}&quot; from
            this list? This action cannot be undone.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              color="red"
              onClick={handleDelete}
              disabled={removeFromList.isPending}
            >
              Remove
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <style jsx>{`
        .movie-list-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: var(--accent-8);
        }
      `}</style>
    </>
  );
}
