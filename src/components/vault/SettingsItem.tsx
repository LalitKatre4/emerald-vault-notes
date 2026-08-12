import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <div className="vault-card divide-y divide-border overflow-hidden">{children}</div>
    </section>
  );
}

export function SettingsItem({
  icon: Icon,
  label,
  description,
  to,
  onClick,
  control,
  danger,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  to?: string;
  onClick?: () => void;
  control?: ReactNode;
  danger?: boolean;
}) {
  const inner = (
    <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 text-left">
      <span
        className={cn(
          "rounded-xl p-2",
          danger ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className={cn("block truncate text-sm font-medium", danger && "text-destructive")}>
          {label}
        </span>
        {description && (
          <span className="block truncate text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span className="shrink-0">
        {control ?? <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </span>
    </div>
  );

  if (to)
    return (
      <Link to={to} className="block transition-colors hover:bg-accent/40">
        {inner}
      </Link>
    );
  if (onClick)
    return (
      <button onClick={onClick} className="block w-full transition-colors hover:bg-accent/40">
        {inner}
      </button>
    );
  return <div>{inner}</div>;
}
