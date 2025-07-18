import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import "@radix-ui/themes/styles.css";
import { Container, Flex, Heading, Theme, ThemePanel } from "@radix-ui/themes";
import { UserAvatar } from "./_components/userAvatar";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Movie List App",
  description: "Organize and track your movie collections",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session?.user) {
    void api.list.getAll.prefetch();
  }
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <SessionProvider>
            <Theme appearance="dark">
              <Container>
                <Flex justify="between" align="center" gap="4">
                  <Heading>Movie List App</Heading>
                  <UserAvatar
                    image={session?.user.image ?? undefined}
                    session={!!session}
                  />
                </Flex>
                {/*<ThemePanel />*/}
                {children}
              </Container>
            </Theme>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
