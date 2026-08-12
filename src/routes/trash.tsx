import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { EmptyState } from "@/components/vault/EmptyState";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { CategoryChip } from "@/components/vault/CategoryChip";
import { Button } from "@/components/ui/button";
import { formatWhen, useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/trash")({
  head: () => ({
    meta: [
      { title: "Recently Deleted — Private Notes Vault" },
      { name: "description", content: "Restore or permanently remove deleted private notes." },
      { property: "og:title", content: "Recently Deleted" },
      { property: "og:description", content: "Deleted notes are kept here temporarily." },
    ],
  }),
  component: TrashScreen,
});

function TrashScreen() {
  const { trashedNotes, restoreNote, deleteForever, emptyTrash } = useVault();
  const [permanent, setPermanent] = useState<string | null>(null);
  const [emptying, setEmptying] = useState(false);

  return (
    <AppShell>
      <ScreenHeader
        title="Recently Deleted"
        subtitle="Deleted notes are kept here temporarily."
        back="/home"
      />

      <div className="space-y-3">
        {trashedNotes.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title="Trash is empty"
            description="Deleted notes will appear here before they're removed for good."
          />
        ) : (
          trashedNotes.map((n) => (
            <div key={n.id} className="vault-card p-4">
              <h3 className="truncate text-[15px] font-semibold">{n.title}</h3>
              <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{n.content}</p>
              <div className="mt-3 flex items-center gap-2">
                <CategoryChip name={n.category} />
                <span className="text-[11px] text-muted-foreground">
                  Deleted {formatWhen(n.deletedAt!)}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  className="h-9 flex-1 rounded-xl text-xs"
                  onClick={() => {
                    restoreNote(n.id);
                    toast.success("Note restored");
                  }}
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" /> Restore
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 flex-1 rounded-xl text-xs text-destructive hover:text-destructive"
                  onClick={() => setPermanent(n.id)}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {trashedNotes.length > 0 && (
        <Button
          variant="ghost"
          onClick={() => setEmptying(true)}
          className="mt-5 h-12 w-full rounded-2xl border border-destructive/40 text-destructive hover:text-destructive"
        >
          Empty Trash
        </Button>
      )}

      <ConfirmationDialog
        open={Boolean(permanent)}
        onOpenChange={(v) => !v && setPermanent(null)}
        title="Delete permanently?"
        description="This action cannot be undone."
        confirmLabel="Delete Permanently"
        onConfirm={() => {
          if (permanent) deleteForever(permanent);
          toast.success("Note deleted permanently");
          setPermanent(null);
        }}
      />

      <ConfirmationDialog
        open={emptying}
        onOpenChange={setEmptying}
        title="Permanently delete all notes?"
        description="This action cannot be undone."
        confirmLabel="Delete Permanently"
        onConfirm={() => {
          emptyTrash();
          toast.success("Trash emptied");
          setEmptying(false);
        }}
      />
    </AppShell>
  );
}
