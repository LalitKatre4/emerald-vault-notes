import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, ListChecks, Heart, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVault, type Note } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export function NoteEditor({ note }: { note?: Note }) {
  const navigate = useNavigate();
  const { state, createNote, updateNote } = useVault();
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [category, setCategory] = useState(note?.category ?? state.settings.defaultCategory);
  const [favorite, setFavorite] = useState(note?.favorite ?? false);
  const [locked, setLockedNote] = useState(note?.locked ?? false);
  const [saved, setSaved] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!title && !content) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 900);
    return () => clearTimeout(t);
  }, [title, content, category, favorite, locked]);

  const wrap = (before: string, after = before) => {
    const el = areaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    setContent(content.slice(0, s) + before + content.slice(s, e) + after + content.slice(e));
    requestAnimationFrame(() => el.focus());
  };

  const prefixLine = (prefix: string) => setContent((c) => (c ? `${c}\n${prefix}` : prefix));

  const save = () => {
    if (note) {
      updateNote(note.id, { title, content, category, favorite, locked });
      toast.success("Changes saved securely");
      navigate({ to: "/note/$id", params: { id: note.id } });
    } else {
      const created = createNote({ title, content, category, favorite, locked });
      toast.success("Note saved securely");
      navigate({ to: "/note/$id", params: { id: created.id } });
    }
  };

  return (
    <AppShell showNav={false}>
      <ScreenHeader
        title={note ? "Edit Note" : "New Note"}
        subtitle={note ? "Last saved just now" : "Autosaved to your vault"}
        back={note ? "/notes" : "/home"}
      />

      <div className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="h-12 rounded-2xl text-base font-semibold"
        />

        <div className="vault-card overflow-hidden">
          <div className="flex items-center gap-1 border-b border-border px-2 py-2">
            <ToolbarButton label="Bold" onClick={() => wrap("**")} icon={Bold} />
            <ToolbarButton label="Italic" onClick={() => wrap("_")} icon={Italic} />
            <ToolbarButton label="Bullet list" onClick={() => prefixLine("• ")} icon={List} />
            <ToolbarButton label="Checklist" onClick={() => prefixLine("[ ] ")} icon={ListChecks} />
            <span
              className={cn(
                "ml-auto pr-2 text-[11px]",
                saved ? "text-primary" : "text-muted-foreground",
              )}
            >
              {saved ? "Saved securely" : "Editing…"}
            </span>
          </div>
          <textarea
            ref={areaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something private…"
            className="min-h-56 w-full resize-none bg-transparent p-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="vault-card divide-y divide-border">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
            <Label className="text-sm">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ToggleRow
            icon={Heart}
            label="Favorite"
            checked={favorite}
            onChange={setFavorite}
          />
          <ToggleRow icon={Lock} label="Lock note" checked={locked} onChange={setLockedNote} />
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-primary/25 bg-primary/10 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          Stored inside your protected vault.
        </div>

        <div className="flex gap-3 pb-4">
          <Button
            variant="secondary"
            className="h-12 flex-1 rounded-2xl"
            onClick={() => navigate({ to: note ? "/note/$id" : "/home", params: { id: note?.id ?? "" } })}
          >
            Cancel
          </Button>
          <Button className="h-12 flex-1 rounded-2xl font-semibold" onClick={save}>
            {note ? "Save Changes" : "Save Note"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Bold;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Heart;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
      <span className="rounded-xl bg-primary/10 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="truncate text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
