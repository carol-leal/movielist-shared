import type { SearchMovieResponse } from "~/types/general";

export const searchMovie = async (
  query: string,
): Promise<SearchMovieResponse | null> => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_BEARER_HEADER,
    },
  };

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&language=en-US&page=1`,
      options,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as unknown as SearchMovieResponse;

    return data;
  } catch (error) {
    console.error("Failed to fetch movie data:", error);
    return null;
  }
};
