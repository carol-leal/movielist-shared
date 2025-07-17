import { Button, Text } from "@radix-ui/themes";
import { useState } from "react";
import { api as apiReact } from "~/trpc/react";

export default function CopyShareLinkButton({ listId }: { listId: number }) {
  const share = apiReact.list.shareLink.useMutation();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      const token = await share.mutateAsync({ listId });
      const link = `${window.location.origin}/share/join?token=${token}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to generate share link.");
    }
  };

  return (
    <>
      <Button onClick={handleCopy} size="1" variant="soft">
        {copied ? "Link Copied!" : "Share List"}
      </Button>
      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </>
  );
}
