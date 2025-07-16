"use client";
import { Form } from "radix-ui";
import { Popover, Button, TextArea } from "@radix-ui/themes";

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
  );
}
