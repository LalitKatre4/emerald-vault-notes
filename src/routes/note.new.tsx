import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/vault/NoteEditor";

export const Route = createFileRoute("/note/new")({
  head: () => ({
    meta: [
      { title: "New Note — Private Notes Vault" },
      { name: "description", content: "Write a new private note and store it securely." },
      { property: "og:title", content: "New Note" },
      { property: "og:description", content: "Write a new private note." },
    ],
  }),
  component: () => <NoteEditor />,
});
