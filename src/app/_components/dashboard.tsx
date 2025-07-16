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
} from "@radix-ui/themes";
import Link from "next/link";
import { api as apiReact } from "~/trpc/react";
import { searchMovie } from "../api/tmdb/searchMovie";
import Search from "./dashboard/search";
import NewList from "./dashboard/newList";

import { useEffect, useState } from "react";
import type { Movie } from "~/types/general";
import Image from "next/image";
import { formatDate } from "~/utils/helpers";
import Rating from "./dashboard/rating";
import { fetchAllGenres } from "../api/tmdb/fetchAllGenres";

export default function Dashboard() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadGenres() {
      const result = await fetchAllGenres();
      if (result?.genres) {
        const map: Record<number, string> = {};
        result.genres.forEach((genre) => {
          map[genre.id] = genre.name;
        });
        setGenreMap(map);
      }
    }

    void loadGenres();
  }, []);

  const utils = apiReact.useUtils();
  const createList = apiReact.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.getAll.invalidate();
      await utils.list.getAll.refetch();
    },
  });

  const { data: myLists, isLoading } = apiReact.list.getAll.useQuery();

  const onSearch = async (query: string) => {
    const result = await searchMovie(query);
    if (result?.results) {
      setSearchResults(result.results);
    } else {
      setSearchResults([]);
    }
  };

  console.log("Search Results:", searchResults);

  return (
    <Flex direction="column" gap="4">
      <Search onSearch={onSearch} />
      <Flex justify="between" align="center" gap="2">
        <Text>Select a list: </Text>
        <NewList createList={createList} />
      </Flex>

      <Heading size="3">Search Results</Heading>
      {searchResults.length > 0 ? (
        <Grid columns="3" gap="3">
          {searchResults.map((movie) => (
            <Card key={movie.id}>
              <Inset side="top" clip="padding-box" pb="current">
                <div style={{ position: "relative" }}>
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
                </div>
              </Inset>
              <Heading size="2">{movie.title}</Heading>
              <Text>Release date: {formatDate(movie.release_date)}</Text>
              <Text>{movie.overview}</Text>
              <Text size="2">
                <Flex gap="3" align="center" wrap="wrap">
                  <Text color="gray">Genres:</Text>
                  {movie.genre_ids && movie.genre_ids.length > 0 ? (
                    movie.genre_ids.flatMap((id, index, array) => [
                      <Text key={`genre-${id}`} size="1">
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
              </Text>
            </Card>
          ))}
        </Grid>
      ) : (
        <Text>No movies found. Try another search.</Text>
      )}

      <Heading size="3">My Lists</Heading>
      <Grid columns="3" gap="3">
        {isLoading ? (
          <Spinner size="3" />
        ) : myLists && myLists.length > 0 ? (
          myLists.map((item) => (
            <Link href={`/list/${encodeURIComponent(item.name)}`} key={item.id}>
              <Card>
                <Heading size="2">{item.name}</Heading>
                <Text>{item.description}</Text>
              </Card>
            </Link>
          ))
        ) : (
          <Text>No lists found. Please create a new list.</Text>
        )}
      </Grid>
    </Flex>
  );
}
