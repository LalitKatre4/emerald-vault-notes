import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function SecurityCard({
  title = "Vault Protected",
  description = "Your notes are secured",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 to-card p-4 shadow-[var(--shadow-vault)]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <div className="rounded-2xl bg-primary/20 p-2.5 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
