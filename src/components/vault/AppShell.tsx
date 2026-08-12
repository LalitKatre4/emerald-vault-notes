import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, FileText, Heart, Settings as SettingsIcon, Plus } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useVault } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((t) => {
          const active = pathname === t.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_var(--primary)]")} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({
  children,
  showNav = true,
  showFab = false,
  guard = true,
}: {
  children: ReactNode;
  showNav?: boolean;
  showFab?: boolean;
  guard?: boolean;
}) {
  const { locked, ready } = useVault();
  const navigate = useNavigate();

  useEffect(() => {
    if (guard && ready && locked) navigate({ to: "/lock" });
  }, [guard, ready, locked, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-lg px-4 pt-5 pb-28">{children}</div>
      {showFab && (
        <Link
          to="/note/new"
          aria-label="New note"
          className="fixed bottom-24 right-[max(1rem,calc(50%-15rem))] z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Link>

      )}
      {showNav && <BottomNavigation />}
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-5">
      <div className="flex min-w-0 items-center gap-3">
        {back && (
          <button
            onClick={() => navigate({ to: back })}
            aria-label="Back"
            className="shrink-0 rounded-full border border-border bg-card p-2 text-foreground transition-colors hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </header>
  );
}
