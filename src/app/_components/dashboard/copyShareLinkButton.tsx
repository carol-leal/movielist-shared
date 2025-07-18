import { Button, Tooltip } from "@radix-ui/themes";
import { useState } from "react";
import { api as apiReact } from "~/trpc/react";
import {
  Share1Icon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export default function CopyShareLinkButton({ listId }: { listId: number }) {
  const share = apiReact.list.shareLink.useMutation();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicked inside a Link
    e.stopPropagation();

    try {
      const token = await share.mutateAsync({ listId });
      const link = `${window.location.origin}/share/join?token=${token}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <Tooltip
      content={
        copied ? "Copied!" : error ? "Failed to copy" : "Copy share link"
      }
    >
      <Button
        onClick={handleCopy}
        size="2"
        variant="soft"
        color={copied ? "green" : error ? "red" : undefined}
        disabled={share.isPending}
        style={{ width: "100%" }}
      >
        {copied ? (
          <>
            <CheckIcon width="16" height="16" />
            Link Copied!
          </>
        ) : error ? (
          <>
            <ExclamationTriangleIcon width="16" height="16" />
            Failed
          </>
        ) : (
          <>
            <Share1Icon width="16" height="16" />
            Share List
          </>
        )}
      </Button>
    </Tooltip>
  );
}
