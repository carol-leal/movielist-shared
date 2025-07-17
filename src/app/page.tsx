import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import Dashboard from "./_components/dashboard";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
