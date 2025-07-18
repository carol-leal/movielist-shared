"use client";
import {
  Dialog,
  Button,
  TextArea,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function NewList({
  createList,
}: {
  createList: {
    mutate: (data: { name: string; description: string }) => void;
    isPending: boolean;
  };
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createList.mutate({
      name: name.trim(),
      description: description.trim(),
    });

    // Reset form and close dialog
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="3">
          <PlusIcon width="16" height="16" />
          New List
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Create New List</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Give your movie list a name and optional description.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                List Name *
              </Text>
              <TextField.Root
                placeholder="e.g., Weekend Watchlist, 80s Classics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Description
              </Text>
              <TextArea
                placeholder="What's this list about? (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: 80 }}
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              disabled={!name.trim() || createList.isPending}
            >
              {createList.isPending ? "Creating..." : "Create List"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
