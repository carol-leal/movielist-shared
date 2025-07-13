// src/app/page.tsx
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { HydrateClient } from "~/trpc/server";
import Dashboard from "./_components/dashboard";

export default async function HomePage() {
  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
