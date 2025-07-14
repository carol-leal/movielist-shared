import Link from "next/link";
import {
  Box,
  Card,
  Flex,
  Grid,
  Inset,
  Strong,
  Text,
  TextField,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Flex direction="column" gap="4">
      <Flex direction="row" gap="4" justify="between">
        <Text>This is {slug}</Text>
        <Link href="/">Go back to dashboard</Link>
      </Flex>
      <TextField.Root placeholder="Search the list...">
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Flex>
        <Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
          <Box maxWidth="240px">
            <Card size="2">
              <Inset clip="padding-box" side="top" pb="current">
                <img
                  src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Bold typography"
                  style={{
                    display: "block",
                    objectFit: "cover",
                    width: "100%",
                    height: 140,
                    backgroundColor: "var(--gray-5)",
                  }}
                />
              </Inset>
              <Text as="p" size="3">
                <Strong>Typography</Strong> is the art and technique of
                arranging type to make written language legible, readable and
                appealing when displayed.
              </Text>
            </Card>
          </Box>
        </Grid>
      </Flex>
    </Flex>
  );
}
