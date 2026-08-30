import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Lock,
  Plus,
  FileText,
  Heart,
  FolderOpen,
  Trash2,
  Crown,
  ShieldCheck,
  DatabaseBackup,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/vault/AppShell";
import { SecurityCard } from "@/components/vault/SecurityCard";
import { NoteCard } from "@/components/vault/NoteCard";
import { EmptyState } from "@/components/vault/EmptyState";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { sortNotes, useVault, type Note } from "@/lib/vault-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Vault Home — Private Notes Vault" },
      { name: "description", content: "Your secured notes, favorites and categories at a glance." },
      { property: "og:title", content: "Vault Home" },
      { property: "og:description", content: "Your thoughts. Your privacy." },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { activeNotes, state, setLocked, trashNote } = useVault();
  const navigate = useNavigate();
  const [pending, setPending] = useState<Note | null>(null);

  const recent = sortNotes(activeNotes, "updated").slice(0, 4);
  const stats = [
    { label: "Total Notes", value: activeNotes.length, icon: FileText },
    { label: "Favorites", value: activeNotes.filter((n) => n.favorite).length, icon: Heart },
    { label: "Categories", value: state.categories.length, icon: FolderOpen },
  ];

  return (
    <AppShell showFab>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-5">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">Private Notes</h1>
          <p className="truncate text-xs text-muted-foreground">Your thoughts. Your privacy.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/search"
            aria-label="Search"
            className="rounded-full border border-border bg-card p-2.5 hover:bg-accent"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            aria-label="Lock vault"
            onClick={() => {
              setLocked(true);
              navigate({ to: "/lock" });
            }}
            className="rounded-full border border-border bg-card p-2.5 text-primary hover:bg-accent"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </header>

      <SecurityCard />

      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="vault-card p-3 text-center">
            <s.icon className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-2 text-xl font-semibold">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Button
        asChild
        className="mt-4 h-12 w-full rounded-2xl text-base font-semibold shadow-[var(--shadow-glow)]"
      >
        <Link to="/note/new">
          <Plus className="mr-1 h-5 w-5" /> New Note
        </Link>
      </Button>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <QuickLink to="/categories" icon={FolderOpen} label="Categories" />
        <QuickLink to="/trash" icon={Trash2} label="Recently Deleted" />
        <QuickLink to="/security" icon={ShieldCheck} label="Security" />
        <QuickLink to="/backup" icon={DatabaseBackup} label="Backup" />
      </div>

      

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent Notes</h2>
        <Link to="/notes" className="text-xs font-medium text-primary">
          View all
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {recent.length === 0 ? (
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
          recent.map((n) => <NoteCard key={n.id} note={n} onDelete={setPending} />)
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

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof FolderOpen;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="vault-card flex items-center gap-3 p-3.5 transition-colors hover:border-primary/40"
    >
      <span className="rounded-xl bg-primary/10 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 truncate text-sm font-medium">{label}</span>
    </Link>
  );
}
