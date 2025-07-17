import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function JoinSharedListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const rawToken = resolvedSearchParams.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  if (!token) {
    return <div>Invalid or missing token.</div>;
  }

  const list = await db.list.findFirst({
    where: { shareToken: token },
  });

  if (!list) {
    return <div>Invalid share link. List not found.</div>;
  }

  const existingShare = await db.listShare.findFirst({
    where: {
      listId: list.id,
      userId: session.user.id,
    },
  });

  if (!existingShare && list.createdById !== session.user.id) {
    await db.listShare.create({
      data: {
        listId: list.id,
        userId: session.user.id,
      },
    });
  }

  redirect(`/list/${list.id}/${encodeURIComponent(list.name)}`);
}
