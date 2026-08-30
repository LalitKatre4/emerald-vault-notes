import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileQuestion,
  FolderInput,
  Heart,
  Lock,
  MoreVertical,
  Pencil,
  Share,
  Trash2,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { EmptyState } from "@/components/vault/EmptyState";
import { CategoryChip } from "@/components/vault/CategoryChip";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatFull, useVault } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/note/$id")({
  head: () => ({
    meta: [
      { title: "View Note — Private Notes Vault" },
      { name: "description", content: "Read a private note stored securely in your vault." },
      { property: "og:title", content: "View Note" },
      { property: "og:description", content: "Read your private note." },
    ],
  }),
  component: ViewNote,
});

function ViewNote() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getNote, toggleFavorite, updateNote, trashNote, state, ready } = useVault();
  const note = getNote(id);
  const [confirm, setConfirm] = useState(false);

  if (!ready) return <AppShell showNav={false}>{null}</AppShell>;

  if (!note)
    return (
      <AppShell showNav={false}>
        <EmptyState
          icon={FileQuestion}
          title="Note not found"
          description="This note may have been deleted or moved to trash."
          action={
            <Button asChild className="rounded-xl">
              <Link to="/notes">Back to notes</Link>
            </Button>
          }
        />
      </AppShell>
    );

  return (
    <AppShell showNav={false}>
      <ScreenHeader
        title="Note"
        back="/notes"
        right={
          <>
            <button
              aria-label="Toggle favorite"
              onClick={() => toggleFavorite(note.id)}
              className="rounded-full border border-border bg-card p-2.5"
            >
              <Heart className={cn("h-4 w-4", note.favorite && "fill-gold text-gold")} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="More"
                className="rounded-full border border-border bg-card p-2.5"
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FolderInput className="mr-2 h-4 w-4" /> Move to category
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {state.categories.map((c) => (
                      <DropdownMenuItem
                        key={c.id}
                        onClick={() => {
                          updateNote(note.id, { category: c.name });
                          toast.success(`Moved to ${c.name}`);
                        }}
                      >
                        {c.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
  onSelect={() => {
    const nextLocked = !note.locked;

    updateNote(note.id, {
      locked: nextLocked,
    });

    toast.success(
      nextLocked
        ? "Note locked successfully"
        : "Note unlocked successfully",
    );
  }}
>
                  {note.locked ? (
                    <Unlock className="mr-2 h-4 w-4" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {note.locked ? "Unlock note" : "Lock note"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Note exported securely")}>
                  <Share className="mr-2 h-4 w-4" /> Export
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <article className="vault-card p-5">
        <div className="flex items-center gap-2">
          {note.locked && <Lock className="h-4 w-4 shrink-0 text-gold" />}
          <h2 className="text-xl font-semibold leading-snug">{note.title}</h2>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CategoryChip name={note.category} />
          {note.favorite && <CategoryChip name="Favorite" className="border-gold/40 text-gold" />}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 border-y border-border py-3 text-[11px] text-muted-foreground">
          <div>
            <dt className="uppercase tracking-wide">Created</dt>
            <dd className="mt-0.5 text-foreground">{formatFull(note.createdAt)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Updated</dt>
            <dd className="mt-0.5 text-foreground">{formatFull(note.updatedAt)}</dd>
          </div>
        </dl>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
      </article>

      <div className="mt-5 flex gap-3">
      <Button
  className="h-12 flex-1 rounded-2xl font-semibold"
  onClick={() =>
    navigate({
      to: "/note/$id/edit",
      params: { id: note.id },
    })
  }
>
  <Pencil className="mr-1 h-4 w-4" />
  Edit
</Button>
        <Button
          variant="ghost"
          className="h-12 flex-1 rounded-2xl border border-destructive/40 text-destructive hover:text-destructive"
          onClick={() => setConfirm(true)}
        >
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </div>

      <ConfirmationDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this note?"
        description="It will be moved to Recently Deleted."
        confirmLabel="Move to Trash"
        onConfirm={() => {
          trashNote(note.id);
          toast.success("Moved to Trash");
          navigate({ to: "/notes" });
        }}
      />
    </AppShell>
  );
}
