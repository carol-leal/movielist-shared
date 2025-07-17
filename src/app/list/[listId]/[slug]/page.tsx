import Link from "next/link";
import { Flex, Grid, Text } from "@radix-ui/themes";
import MovieSearch from "~/app/_components/list/movieSearch";
import { api } from "~/trpc/server";
import MovieListCard from "~/app/_components/list/movieListCard";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; listId: string }>;
}) {
  const { slug, listId } = await params;

  const numericListId = parseInt(listId, 10);
  const movieData = await api.movie.getAll({ listId: numericListId });

  return (
    <Flex direction="column" gap="4">
      <Flex direction="row" gap="4" justify="between">
        <Text>This is {slug}</Text>
        <Link href="/">Go back to dashboard</Link>
      </Flex>
      <MovieSearch listId={numericListId} />
      <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
        {movieData.map((movie) => (
          <MovieListCard key={movie.id} movie={movie} />
        ))}
      </Grid>
    </Flex>
  );
}
