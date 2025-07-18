import { api } from "~/trpc/server";
import ClientMovieList from "~/app/_components/list/clientMoviePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; listId: string }>;
}) {
  const { slug, listId } = await params;

  const numericListId = parseInt(listId, 10);
  const initialMovieData = await api.movie.getAll({ listId: numericListId });

  return (
    <ClientMovieList
      initialMovieData={initialMovieData}
      slug={slug}
      listId={numericListId}
    />
  );
}
