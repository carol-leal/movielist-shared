import Link from "next/link";
import { Text } from "@radix-ui/themes";
import { HydrateClient } from "~/trpc/server";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <HydrateClient>
      <Text>This is {slug}</Text>
      <main>
        <h1>
          Create <span>T3</span> App
        </h1>
        <div>
          <Link
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3>First Steps →</h3>
            <div>
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link href="https://create.t3.gg/en/introduction" target="_blank">
            <h3>Documentation →</h3>
            <div>
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}
