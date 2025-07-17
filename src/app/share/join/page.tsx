import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function JoinSharedListPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;
  const token = searchParams.token;

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
      userId,
    },
  });

  if (!existingShare && list.createdById !== userId) {
    await db.listShare.create({
      data: {
        listId: list.id,
        userId,
      },
    });
  }

  redirect(`/list/${list.id}/${encodeURIComponent(list.name)}`);
}
