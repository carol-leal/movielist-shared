import { Container, Text, Heading, Button } from "@radix-ui/themes";
import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.list.getAll.prefetch();
  }

  const list = [
    {
      slug: "my-movie-list",
      title: "My Movie List",
      description: "A list of my favorite movies.",
    },
    {
      slug: "watch-later",
      title: "Watch Later",
      description: "Movies I plan to watch in the future.",
    },
  ];

  return (
    <HydrateClient>
      <Container>
        <Heading>Welcome to the Movie List App!</Heading>
        <Text>Select a list to access</Text>
        {list.map((item) => (
          <Button key={item.slug}>
            <Link href={`/list/${item.slug}`}>Go to {item.title}</Link>
          </Button>
        ))}
      </Container>
    </HydrateClient>
  );
}
