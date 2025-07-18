"use client";
import {
  Text,
  Heading,
  Flex,
  Grid,
  Card,
  Spinner,
  Box,
} from "@radix-ui/themes";
import Link from "next/link";
import { api as apiReact } from "~/trpc/react";
import NewList from "./dashboard/newList";
import CopyShareLinkButton from "./dashboard/copyShareLinkButton";
import { PlayIcon } from "@radix-ui/react-icons";

export default function Dashboard() {
  const utils = apiReact.useUtils();
  const createList = apiReact.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.getAll.invalidate();
    },
  });

  const { data: myLists, isLoading } = apiReact.list.getAll.useQuery();

  // Separate owned and shared lists for better organization
  const ownedLists =
    myLists?.filter((list) => list.createdBy.id === list.createdById) ?? [];
  const sharedLists =
    myLists?.filter((list) => list.createdBy.id !== list.createdById) ?? [];

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-1)" }}>
      <Flex
        direction="column"
        gap="6"
        px={{ initial: "4", md: "6" }}
        py="5"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Header Section */}
        <Flex justify="between" align="center" wrap="wrap" gap="3" mb="4">
          <Flex align="center" gap="3">
            <Box
              style={{
                background: "var(--accent-9)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayIcon width="24" height="24" color="white" />
            </Box>
            <Box>
              <Heading size="6" weight="bold">
                My Movie Lists
              </Heading>
              <Text size="2" color="gray">
                Organize and track your movie collections
              </Text>
            </Box>
          </Flex>
          <NewList createList={createList} />
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="3" />
          </Flex>
        ) : (
          <>
            {/* Owned Lists Section */}
            {ownedLists.length > 0 && (
              <Box mb="6">
                <Heading size="4" mb="4" weight="medium">
                  My Lists
                </Heading>
                <Grid
                  columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
                  gap="4"
                >
                  {ownedLists.map((item) => (
                    <ListCard key={item.id} list={item} isOwned={true} />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Shared Lists Section */}
            {sharedLists.length > 0 && (
              <Box>
                <Heading size="4" mb="4" weight="medium">
                  Shared with Me
                </Heading>
                <Grid
                  columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
                  gap="4"
                >
                  {sharedLists.map((item) => (
                    <ListCard key={item.id} list={item} isOwned={false} />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Empty State */}
            {myLists?.length === 0 && (
              <Card
                size="3"
                style={{
                  padding: "60px",
                  textAlign: "center",
                  backgroundColor: "var(--gray-2)",
                  border: "2px dashed var(--gray-6)",
                }}
              >
                <PlayIcon
                  width="48"
                  height="48"
                  style={{ margin: "0 auto 16px", opacity: 0.5 }}
                />
                <Heading size="4" mb="2">
                  No lists yet
                </Heading>
                <Text color="gray" size="3">
                  Create your first movie list to get started
                </Text>
              </Card>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
}

function ListCard({
  list,
  isOwned,
}: {
  list: {
    id: number;
    name: string;
    description: string | null;
    createdBy: {
      id: string;
      name: string | null;
    };
  };
  isOwned: boolean;
}) {
  return (
    <Card
      size="2"
      style={{
        height: "100%",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--gray-5)",
      }}
      className="hover-card"
    >
      <Link
        href={`/list/${list.id}/${encodeURIComponent(list.name)}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          p="4"
          style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Flex justify="between" align="start" mb="2">
            <Heading size="3" weight="medium" style={{ flexGrow: 1 }}>
              {list.name}
            </Heading>
            {!isOwned && (
              <Text
                size="1"
                color="gray"
                style={{
                  backgroundColor: "var(--gray-3)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                Shared
              </Text>
            )}
          </Flex>

          <Text
            size="2"
            color="gray"
            style={{
              flexGrow: 1,
              marginBottom: "16px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {list.description ?? "No description provided"}
          </Text>

          <Box mt="auto">
            <Text size="1" color="gray">
              Created by {list.createdBy.name ?? "Unknown"}
            </Text>
          </Box>
        </Box>
      </Link>

      {isOwned && (
        <Box px="4" pb="4">
          <CopyShareLinkButton listId={list.id} />
        </Box>
      )}

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: var(--accent-8);
        }
      `}</style>
    </Card>
  );
}
