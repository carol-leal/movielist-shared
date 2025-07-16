"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function Search({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <TextField.Root
      placeholder="Search for a movie..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        onSearch(searchQuery);
      }}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
}
