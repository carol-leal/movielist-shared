"use client";
import { Form } from "radix-ui";
import { Popover, Button, TextArea, Flex, Text } from "@radix-ui/themes";

export default function NewList({
  createList,
}: {
  createList: { mutate: (data: { name: string; description: string }) => void };
}) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">New list</Button>
      </Popover.Trigger>

      <Popover.Content
        width="360px"
        style={{
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Flex direction="column" gap="4">
          <Form.Root
            onSubmit={async (event) => {
              const formData = new FormData(event.currentTarget);
              const name = formData.get("name") as string;
              const description = formData.get("description") as string;
              createList.mutate({ name, description });
              event.currentTarget.reset();
            }}
          >
            <Flex direction="column" gap="3">
              <Form.Field name="name">
                <Flex direction="column" gap="1">
                  <Form.Label>
                    <Text size="1">Name</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <input placeholder="Enter list name" required />
                  </Form.Control>
                </Flex>
              </Form.Field>

              <Form.Field name="description">
                <Flex direction="column" gap="1">
                  <Form.Label>
                    <Text size="1">Description</Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextArea placeholder="Optional description..." />
                  </Form.Control>
                </Flex>
              </Form.Field>

              <Form.Submit asChild>
                <Button style={{ marginTop: "12px" }} variant="solid">
                  Create List
                </Button>
              </Form.Submit>
            </Flex>
          </Form.Root>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
