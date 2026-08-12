import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, SearchX } from "lucide-react";
import { SearchBar } from "@/components/vault/SearchBar";
import { NoteCard } from "@/components/vault/NoteCard";
import { EmptyState } from "@/components/vault/EmptyState";
import { CategoryChip } from "@/components/vault/CategoryChip";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Private Notes Vault" },
      { name: "description", content: "Search titles, content and categories inside your vault." },
      { property: "og:title", content: "Search your vault" },
      { property: "og:description", content: "Find any private note instantly." },
    ],
  }),
  component: SearchScreen,
});

function SearchScreen() {
  const navigate = useNavigate();
  const { activeNotes, state } = useVault();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return activeNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q),
    );
  }, [query, activeNotes]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-lg px-4 py-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: "/home" })}
            aria-label="Back"
            className="shrink-0 rounded-full border border-border bg-card p-2.5"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              autoFocus
              placeholder="Search titles, content, categories"
            />
          </div>
        </div>

        {!query && (
          <div className="mt-6">
            <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              Browse by category
            </p>
            <div className="flex flex-wrap gap-2">
              {state.categories.map((c) => (
                <CategoryChip key={c.id} name={c.name} onClick={() => setQuery(c.name)} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {query && results.length === 0 && (
            <EmptyState
              icon={SearchX}
              title="No notes found"
              description="Try searching for another keyword."
            />
          )}
          {results.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
