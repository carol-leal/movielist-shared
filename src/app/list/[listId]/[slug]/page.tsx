import { api } from "~/trpc/server";
import ClientMoviePage from "~/app/_components/list/clientMoviePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; listId: string }>;
}) {
  const { slug, listId } = await params;
  const numericListId = parseInt(listId, 10);
  const movieData = await api.movie.getAll({ listId: numericListId });

  return (
    <ClientMoviePage movieData={movieData} slug={slug} listId={numericListId} />
  );
}
