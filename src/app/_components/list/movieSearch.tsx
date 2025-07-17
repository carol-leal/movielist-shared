"use client";
import { useEffect, useRef, useState } from "react";
import { Heading, Grid, Box, Flex, Text, Button } from "@radix-ui/themes";
import { searchMovie } from "~/app/api/tmdb/searchMovie";
import Search from "../dashboard/search";
import type { Movie } from "~/types/general";
import MovieCard from "./movieCard";
import { fetchAllGenres } from "~/app/api/tmdb/fetchAllGenres";

export default function MovieSearch({ listId }: { listId: number }) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchGenres = async () => {
      const result = await fetchAllGenres();
      if (result?.genres) {
        const map: Record<number, string> = {};
        result.genres.forEach((g) => {
          map[g.id] = g.name;
        });
        setGenreMap(map);
      }
    };
    void fetchGenres();
  }, []);

  const overlayRef = useRef<HTMLDivElement>(null);

  const onSearch = async (query: string) => {
    const result = await searchMovie(query);
    const results = result?.results ?? [];
    setSearchResults(results);
    setIsOverlayOpen(results.length > 0);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setSearchResults([]);
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node)
      ) {
        closeOverlay();
      }
    };
    if (isOverlayOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOverlayOpen]);

  return (
    <>
      <Search onSearch={onSearch} />

      {isOverlayOpen && (
        <>
          {/* Background Blur */}
          <Box
            position="fixed"
            top={"0"}
            left={"0"}
            width="100vw"
            height="100vh"
            style={{
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 999,
            }}
          />

          {/* Overlay Content */}
          <Box
            ref={overlayRef}
            position="fixed"
            top="50%"
            left="50%"
            style={{
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              backgroundColor: "var(--color-panel-solid)",
              padding: "1.5rem",
              width: "95%",
              maxWidth: "1000px",
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: "12px",
              boxShadow: "0 12px 48px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Flex justify="between" mb="2">
              <Heading size="4" mb="4">
                Search Results
              </Heading>
              <Button
                onClick={closeOverlay}
                style={{
                  fontSize: "1.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Close search overlay"
              >
                ✕
              </Button>
            </Flex>

            {searchResults.length > 0 ? (
              <Grid
                columns={{ initial: "1", sm: "2", md: "3" }}
                gap="4"
                width="100%"
              >
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    genreMap={genreMap}
                    listId={listId}
                  />
                ))}
              </Grid>
            ) : (
              <Text color="gray">No movies found. Try another search.</Text>
            )}
          </Box>
        </>
      )}
    </>
  );
}
