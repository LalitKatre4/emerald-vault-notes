import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownUp, FileText, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { SearchBar } from "@/components/vault/SearchBar";
import { CategoryChip } from "@/components/vault/CategoryChip";
import { NoteCard } from "@/components/vault/NoteCard";
import { EmptyState } from "@/components/vault/EmptyState";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortNotes, useVault, type Note, type Settings } from "@/lib/vault-store";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "All Notes — Private Notes Vault" },
      { name: "description", content: "Browse, filter and sort every note stored in your vault." },
      { property: "og:title", content: "All Notes" },
      { property: "og:description", content: "Browse, filter and sort your private notes." },
    ],
  }),
  component: AllNotes,
});

const sortLabels: Record<Settings["sortBy"], string> = {
  updated: "Recently updated",
  created: "Recently created",
  az: "A–Z",
};

function AllNotes() {
  const { activeNotes, state, trashNote, updateSettings } = useVault();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [pending, setPending] = useState<Note | null>(null);
  const sortBy = state.settings.sortBy;

  const filters = ["All", ...state.categories.map((c) => c.name)];

  const notes = useMemo(() => {
    const q = query.toLowerCase();
    const list = activeNotes.filter(
      (n) =>
        (filter === "All" || n.category === filter) &&
        (!q ||
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)),
    );
    return sortNotes(list, sortBy);
  }, [activeNotes, query, filter, sortBy]);

  return (
    <AppShell showFab>
      <ScreenHeader
        title="All Notes"
        subtitle={`${notes.length} note${notes.length === 1 ? "" : "s"}`}
        right={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Filter"
                className="rounded-full border border-border bg-card p-2.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                {filters.map((f) => (
                  <DropdownMenuItem key={f} onClick={() => setFilter(f)}>
                    {f}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Sort"
                className="rounded-full border border-border bg-card p-2.5"
              >
                <ArrowDownUp className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                {(Object.keys(sortLabels) as Settings["sortBy"][]).map((key) => (
                  <DropdownMenuItem key={key} onClick={() => updateSettings({ sortBy: key })}>
                    {sortLabels[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <SearchBar value={query} onChange={setQuery} />

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((f) => (
          <CategoryChip key={f} name={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">Sorted by {sortLabels[sortBy]}</p>

      <div className="mt-3 space-y-3">
        {notes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No private notes yet."
            description="Create your first secure note."
            action={
              <Button asChild className="rounded-xl">
                <Link to="/note/new">Create Note</Link>
              </Button>
            }
          />
        ) : (
          notes.map((n) => <NoteCard key={n.id} note={n} onDelete={setPending} />)
        )}
      </div>

      <ConfirmationDialog
        open={Boolean(pending)}
        onOpenChange={(v) => !v && setPending(null)}
        title="Delete this note?"
        description="It will be moved to Recently Deleted."
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
