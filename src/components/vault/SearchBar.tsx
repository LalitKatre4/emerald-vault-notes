import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search notes",
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search" className="shrink-0">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
