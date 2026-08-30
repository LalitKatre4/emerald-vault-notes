import { createFileRoute, Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { AppShell } from "@/components/vault/AppShell";
import { EmptyState } from "@/components/vault/EmptyState";
import { NoteEditor } from "@/components/vault/NoteEditor";
import { Button } from "@/components/ui/button";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/note/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Note — Private Notes Vault" },
      { name: "description", content: "Update the content, category and privacy of your note." },
      { property: "og:title", content: "Edit Note" },
      { property: "og:description", content: "Update your private note." },
    ],
  }),
  component: EditNote,
});

function EditNote() {
  const { id } = Route.useParams();
  const { getNote, ready } = useVault();
  const note = getNote(id);

  if (!ready) return <AppShell showNav={false}>{null}</AppShell>;
  if (!note)
    return (
      <AppShell showNav={false}>
        <EmptyState
          icon={FileQuestion}
          title="Note not found"
          description="This note may have been deleted."
          action={
            <Button asChild className="rounded-xl">
              <Link to="/notes">Back to notes</Link>
            </Button>
          }
        />
      </AppShell>
    );

  return <NoteEditor note={note} />;
}
