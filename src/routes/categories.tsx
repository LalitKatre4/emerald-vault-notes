import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FolderOpen, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { EmptyState } from "@/components/vault/EmptyState";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { CategoryIcon, iconOptions } from "@/components/vault/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVault } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Private Notes Vault" },
      { name: "description", content: "Organise private notes into secure, custom categories." },
      { property: "og:title", content: "Categories" },
      { property: "og:description", content: "Organise your vault your way." },
    ],
  }),
  component: Categories,
});

function Categories() {
  const { state, activeNotes, addCategory, renameCategory, deleteCategory } = useVault();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("folder");
  const [removing, setRemoving] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIcon("folder");
    setOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      renameCategory(editing, name.trim());
      toast.success("Category renamed");
    } else {
      addCategory(name.trim(), icon);
      toast.success("Category created");
    }
    setOpen(false);
  };

  return (
    <AppShell>
      <ScreenHeader title="Categories" subtitle="Organise your vault" back="/home" />

      <div className="space-y-3">
        {state.categories.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No categories"
            description="Create a category to group related notes."
            action={
              <Button className="rounded-xl" onClick={openCreate}>
                Create Category
              </Button>
            }
          />
        ) : (
          state.categories.map((c) => {
            const count = activeNotes.filter((n) => n.category === c.name).length;
            return (
              <div key={c.id} className="vault-card flex items-center gap-3 p-4">
                <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <CategoryIcon name={c.icon} className="h-5 w-5" />
                </span>
                <Link
                  to="/notes"
                  className="min-w-0 flex-1"
                  onClick={() => toast(`Showing ${c.name} notes`)}
                >
                  <span className="block truncate text-sm font-semibold">{c.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {count} note{count === 1 ? "" : "s"}
                  </span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label="Category actions" className="p-2">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditing(c.id);
                        setName(c.name);
                        setIcon(c.icon);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setRemoving(c.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })
        )}
      </div>

      <Button onClick={openCreate} className="mt-5 h-12 w-full rounded-2xl font-semibold">
        <Plus className="mr-1 h-5 w-5" /> Create Category
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[22rem] rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Rename category" : "Create category"}</DialogTitle>
            <DialogDescription>Group your private notes the way you think.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category name</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Finance"
                className="rounded-xl"
              />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label>Choose icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIcon(opt)}
                      aria-label={opt}
                      className={cn(
                        "flex items-center justify-center rounded-xl border p-2.5",
                        icon === opt
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-secondary text-muted-foreground",
                      )}
                    >
                      <CategoryIcon name={opt} className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="secondary" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(removing)}
        onOpenChange={(v) => !v && setRemoving(null)}
        title="Delete this category?"
        description="Notes in this category stay in your vault."
        confirmLabel="Delete"
        onConfirm={() => {
          if (removing) deleteCategory(removing);
          toast.success("Category deleted");
          setRemoving(null);
        }}
      />
    </AppShell>
  );
}
