"use client";

import {
  Avatar,
  Text,
  Flex,
  Grid,
  Heading,
  Inset,
  Popover,
} from "@radix-ui/themes";
import { UserIcon } from "@phosphor-icons/react";
import Link from "next/link";

export function UserAvatar({
  image,
  session,
}: {
  image?: string;
  session: boolean;
}) {
  console.log(session);
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Flex>
          <Avatar
            src={image}
            alt="User Avatar"
            fallback={<UserIcon />}
            radius="full"
          />
        </Flex>
      </Popover.Trigger>
      <Popover.Content>
        <Flex>
          <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
            {session ? "Sign out" : "Sign in"}
          </Link>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
