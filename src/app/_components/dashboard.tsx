"use client";
import {
  Text,
  Heading,
  Flex,
  Grid,
  Card,
  Spinner,
  Inset,
  Separator,
  Box,
} from "@radix-ui/themes";
import Link from "next/link";
import { api as apiReact } from "~/trpc/react";
import { searchMovie } from "../api/tmdb/searchMovie";
import { fetchAllGenres } from "../api/tmdb/fetchAllGenres";
import Search from "./dashboard/search";
import NewList from "./dashboard/newList";
import Rating from "./dashboard/rating";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Movie } from "~/types/general";
import { formatDate } from "~/utils/helpers";

export default function Dashboard() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  const utils = apiReact.useUtils();
  const createList = apiReact.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.getAll.invalidate();
      await utils.list.getAll.refetch();
    },
  });

  const { data: myLists, isLoading } = apiReact.list.getAll.useQuery();

  useEffect(() => {
    void (async () => {
      const result = await fetchAllGenres();
      if (result?.genres) {
        const map: Record<number, string> = {};
        result.genres.forEach((g) => {
          map[g.id] = g.name;
        });
        setGenreMap(map);
      }
    })();
  }, []);

  const onSearch = async (query: string) => {
    const result = await searchMovie(query);
    setSearchResults(result?.results ?? []);
  };

  return (
    <Flex direction="column" gap="6" px={{ initial: "4", md: "6" }} py="5">
      <Search onSearch={onSearch} />

      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Text>Select a list:</Text>
        <NewList createList={createList} />
      </Flex>
      <Heading size="4" mt="6">
        My Lists
      </Heading>

      {isLoading ? (
        <Flex justify="center" align="center" height="100px">
          <Spinner size="3" />
        </Flex>
      ) : myLists?.length ? (
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
          {myLists.map((item) => (
            <Link
              key={item.id}
              href={`/list/${encodeURIComponent(item.name)}`}
              passHref
            >
              <Card
                asChild
                size="2"
                style={{
                  padding: "16px",
                  height: "100%",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <Flex direction="column" gap="3" style={{ height: "100%" }}>
                  <Heading size="3">{item.name}</Heading>
                  <Text size="2" color="gray">
                    {item.description ?? "No description provided."}
                  </Text>
                </Flex>
              </Card>
            </Link>
          ))}
        </Grid>
      ) : (
        <Flex justify="center" align="center" height="80px">
          <Text color="gray">No lists found. Create your first one above.</Text>
        </Flex>
      )}
      <Heading size="4">Search Results</Heading>

      {searchResults.length > 0 ? (
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4" width="100%">
          {searchResults.map((movie) => (
            <Card
              key={movie.id}
              size="2"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Inset side="top" clip="padding-box" pb="current">
                <Box position="relative">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    style={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "var(--gray-5)",
                    }}
                  />
                  <Rating rating={movie.vote_average} />
                </Box>
              </Inset>

              <Box style={{ flexGrow: 1, paddingTop: "1rem" }}>
                <Flex direction="column" gap="2">
                  <Heading size="3">{movie.title}</Heading>

                  <Text size="1" color="gray">
                    Release date: {formatDate(movie.release_date)}
                  </Text>

                  <Text size="2">{movie.overview}</Text>
                </Flex>
              </Box>

              <Box mt="3">
                <Flex gap="2" align="center" wrap="wrap">
                  <Text size="1" color="gray">
                    Genres:
                  </Text>
                  {movie.genre_ids && movie.genre_ids.length > 0 ? (
                    movie.genre_ids.flatMap((id, index, array) => [
                      <Text
                        key={`genre-${id}`}
                        size="1"
                        weight="medium"
                        color="plum"
                      >
                        {genreMap[id] ?? "Unknown"}
                      </Text>,
                      index < array.length - 1 ? (
                        <Separator key={`sep-${id}`} orientation="vertical" />
                      ) : null,
                    ])
                  ) : (
                    <Text size="1" color="gray">
                      None
                    </Text>
                  )}
                </Flex>
              </Box>
            </Card>
          ))}
        </Grid>
      ) : (
        <Text color="gray">No movies found. Try another search.</Text>
      )}
    </Flex>
  );
}
