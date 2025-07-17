"use client";
import { Text, Heading, Flex, Grid, Card, Spinner } from "@radix-ui/themes";
import Link from "next/link";
import { api as apiReact } from "~/trpc/react";
import NewList from "./dashboard/newList";
import CopyShareLinkButton from "./dashboard/copyShareLinkButton";

export default function Dashboard() {
  const utils = apiReact.useUtils();
  const createList = apiReact.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.getAll.invalidate();
      await utils.list.getAll.refetch();
    },
  });

  const { data: myLists, isLoading } = apiReact.list.getAll.useQuery();

  return (
    <Flex direction="column" gap="6" px={{ initial: "4", md: "6" }} py="5">
      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Heading size="4" mt="6">
          My Lists
        </Heading>
        <NewList createList={createList} />
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" height="100px">
          <Spinner size="3" />
        </Flex>
      ) : myLists?.length ? (
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
          {myLists.map((item) => (
            <Link
              key={item.id}
              href={`/list/${item.id}/${encodeURIComponent(item.name)}`}
              passHref
            >
              <Card
                asChild
                size="2"
                style={{
                  padding: "16px",
                  height: "100%",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <Flex direction="column" gap="3" style={{ height: "100%" }}>
                  <Heading size="3">{item.name}</Heading>
                  <Text size="2" color="gray">
                    {item.description ?? "No description provided."}
                  </Text>
                  <CopyShareLinkButton listId={item.id} />
                </Flex>
              </Card>
            </Link>
          ))}
        </Grid>
      ) : (
        <Flex justify="center" align="center" height="80px">
          <Text color="gray">No lists found. Create your first one above.</Text>
        </Flex>
      )}
    </Flex>
  );
}
