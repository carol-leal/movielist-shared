"use client";

import {
  Text,
  Heading,
  Button,
  Flex,
  Grid,
  Card,
  Popover,
  TextArea,
  Spinner,
} from "@radix-ui/themes";
import Link from "next/link";
import { api as apiReact } from "~/trpc/react";
import { Form } from "radix-ui";

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
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center" gap="2">
        <Text>Select a list: </Text>
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="soft">New list</Button>
          </Popover.Trigger>
          <Popover.Content width="360px">
            <Form.Root
              onSubmit={async (event) => {
                const formData = new FormData(event.currentTarget);
                const name = formData.get("name") as string;
                const description = formData.get("description") as string;
                createList.mutate({ name, description });
                event.currentTarget.reset();
              }}
            >
              <Form.Field name="name">
                <Form.Label>Name</Form.Label>
                <Form.Control asChild>
                  <input className="Input" type="text" required />
                </Form.Control>
              </Form.Field>
              <Form.Field name="description">
                <Form.Label>Description</Form.Label>
                <Form.Control asChild>
                  <TextArea className="Input" />
                </Form.Control>
              </Form.Field>
              <Form.Submit asChild>
                <Button style={{ marginTop: 10 }}>Create List</Button>
              </Form.Submit>
            </Form.Root>
          </Popover.Content>
        </Popover.Root>
      </Flex>

      <Grid columns="3" gap="3">
        {isLoading ? (
          <Spinner size="3" />
        ) : myLists && myLists.length > 0 ? (
          myLists.map((item) => (
            <Link href={`/list/${encodeURIComponent(item.name)}`} key={item.id}>
              <Card>
                <Heading size="2">{item.name}</Heading>
                <Text>{item.description}</Text>
              </Card>
            </Link>
          ))
        ) : (
          <Text>No lists found. Please create a new list.</Text>
        )}
      </Grid>
    </Flex>
  );
}
