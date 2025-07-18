"use client";
import { useEffect, useRef, useState } from "react";
import {
  Heading,
  Grid,
  Box,
  Flex,
  Text,
  Button,
  ScrollArea,
} from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { searchMovie } from "~/app/api/tmdb/searchMovie";
import Search from "../dashboard/search";
import type { Movie } from "~/types/general";
import MovieCard from "./movieCard";
import { fetchAllGenres } from "~/app/api/tmdb/fetchAllGenres";

export default function MovieSearch({ listId }: { listId: number }) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchGenres = async () => {
      const result = await fetchAllGenres();
      if (result?.genres) {
        const map: Record<number, string> = {};
        result.genres.forEach((g: { id: number; name: string }) => {
          map[g.id] = g.name;
        });
        setGenreMap(map);
      }
    };
    void fetchGenres();
  }, []);

  const overlayRef = useRef<HTMLDivElement>(null);

  const onSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchMovie(query);
      const results = result?.results ?? [];
      setSearchResults(results);
      setIsOverlayOpen(results.length > 0);
    } finally {
      setIsSearching(false);
    }
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
      <Box style={{ position: "relative" }}>
        <Search onSearch={onSearch} />
        {isSearching && (
          <Text
            size="1"
            color="gray"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            Searching...
          </Text>
        )}
      </Box>

      {isOverlayOpen && (
        <>
          {/* Background Overlay */}
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              zIndex: 999,
              animation: "fadeIn 0.2s ease-out",
            }}
          />

          {/* Modal Content */}
          <Box
            ref={overlayRef}
            position="fixed"
            top="50%"
            left="50%"
            style={{
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              backgroundColor: "var(--color-panel-solid)",
              width: "95%",
              maxWidth: "1200px",
              maxHeight: "90vh",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            {/* Header */}
            <Flex
              justify="between"
              align="center"
              p="4"
              style={{
                borderBottom: "1px solid var(--gray-5)",
                flexShrink: 0,
              }}
            >
              <Box>
                <Heading size="5" weight="medium">
                  Search Results
                </Heading>
                <Text size="2" color="gray">
                  Found {searchResults.length} movie
                  {searchResults.length !== 1 ? "s" : ""}
                </Text>
              </Box>
              <Button
                size="3"
                variant="ghost"
                color="gray"
                onClick={closeOverlay}
                style={{ padding: "8px" }}
              >
                <Cross2Icon width="20" height="20" />
              </Button>
            </Flex>

            {/* Results Grid */}
            <ScrollArea
              type="hover"
              scrollbars="vertical"
              style={{ flexGrow: 1 }}
            >
              <Box p="4">
                {searchResults.length > 0 ? (
                  <Grid
                    columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
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
                  <Flex align="center" justify="center" height="200px">
                    <Text color="gray" size="3">
                      No movies found. Try another search.
                    </Text>
                  </Flex>
                )}
              </Box>
            </ScrollArea>
          </Box>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translate(-50%, -45%);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}
