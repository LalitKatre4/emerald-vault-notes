import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { NoteCard } from "@/components/vault/NoteCard";
import { EmptyState } from "@/components/vault/EmptyState";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { sortNotes, useVault, type Note } from "@/lib/vault-store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Private Notes Vault" },
      { name: "description", content: "Quickly reach the private notes you marked as favorites." },
      { property: "og:title", content: "Favorites" },
      { property: "og:description", content: "Your most important private notes." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { activeNotes, trashNote } = useVault();
  const [pending, setPending] = useState<Note | null>(null);
  const favorites = sortNotes(
    activeNotes.filter((n) => n.favorite),
    "updated",
  );

  return (
    <AppShell showFab>
      <ScreenHeader title="Favorites" subtitle={`${favorites.length} saved`} />
      <div className="space-y-3">
        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorite notes"
            description="Mark important notes as favorites to find them quickly."
            action={
              <Button asChild variant="secondary" className="rounded-xl">
                <Link to="/notes">Browse notes</Link>
              </Button>
            }
          />
        ) : (
          favorites.map((n) => <NoteCard key={n.id} note={n} onDelete={setPending} />)
        )}
      </div>

      <ConfirmationDialog
        open={Boolean(pending)}
        onOpenChange={(v) => !v && setPending(null)}
        title="Delete this note?"
        confirmLabel="Move to Trash"
        onConfirm={() => {
          if (pending) trashNote(pending.id);
          toast.success("Moved to Trash");
          setPending(null);
        }}
      />
    </AppShell>
  );
}
