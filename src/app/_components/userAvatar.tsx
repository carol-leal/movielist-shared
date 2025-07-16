"use client";

import {
  Avatar,
  Text,
  Flex,
  Popover,
  Box,
  Separator,
  Button,
} from "@radix-ui/themes";
import { PersonIcon, EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function UserAvatar({
  image,
  session,
}: {
  image?: string;
  session: boolean;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          variant="ghost"
          radius="full"
          size="2"
          style={{ padding: 0, width: 36, height: 36 }}
        >
          <Avatar
            src={image}
            fallback={<PersonIcon />}
            radius="full"
            size="2"
            alt="User avatar"
          />
        </Button>
      </Popover.Trigger>

      <Popover.Content
        align="end"
        sideOffset={8}
        style={{
          padding: "12px",
          minWidth: "160px",
          borderRadius: "8px",
        }}
      >
        <Flex direction="column" gap="3">
          <Text size="2" weight="medium">
            {session ? "Logged in" : "Not logged in"}
          </Text>

          <Separator />

          <Box>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              passHref
            >
              <Button
                variant="solid"
                size="2"
                color={session ? "red" : "blue"}
                style={{ width: "100%" }}
              >
                {session ? (
                  <>
                    <ExitIcon
                      width={16}
                      height={16}
                      style={{ marginRight: 6 }}
                    />
                    Sign out
                  </>
                ) : (
                  <>
                    <EnterIcon
                      width={16}
                      height={16}
                      style={{ marginRight: 6 }}
                    />
                    Sign in
                  </>
                )}
              </Button>
            </Link>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
