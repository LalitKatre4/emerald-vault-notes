import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, DatabaseBackup, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { EmptyState } from "@/components/vault/EmptyState";
import { Button } from "@/components/ui/button";
import { formatFull, useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/backup")({
  head: () => ({
    meta: [
      { title: "Backup & Restore — Private Notes Vault" },
      { name: "description", content: "Create secure backups and restore your private notes." },
      { property: "og:title", content: "Backup & Restore" },
      { property: "og:description", content: "Keep a secure copy of your vault." },
    ],
  }),
  component: BackupScreen,
});

function BackupScreen() {
  const { state, addBackup } = useVault();

  return (
    <AppShell>
      <ScreenHeader title="Backup & Restore" subtitle="Keep a secure copy" back="/settings" />

      <div className="space-y-4">
        <BackupCard
          icon={DatabaseBackup}
          title="Backup"
          description="Create a secure backup of your notes."
          action="Create Backup"
          onClick={() => {
            addBackup();
            toast.success("Backup created securely");
          }}
        />
        <BackupCard
          icon={RotateCcw}
          title="Restore"
          description="Restore your notes from a previous backup."
          action="Restore Backup"
          variant="secondary"
          onClick={() =>
            state.backups.length
              ? toast.success("Vault restored from latest backup")
              : toast.error("No backups available yet")
          }
        />
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4">
        <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs text-muted-foreground">
          Keep your backup file in a secure location.
        </p>
      </div>

      <h2 className="mt-7 text-sm font-semibold">Backup history</h2>
      <div className="mt-3 space-y-3">
        {state.backups.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No backups yet"
            description="Create your first secure backup to protect your notes."
          />
        ) : (
          state.backups.map((b) => (
            <div key={b.id} className="vault-card flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{formatFull(b.createdAt)}</p>
                <p className="text-xs text-muted-foreground">{b.notes} notes secured</p>
              </div>
              <Button
                variant="secondary"
                className="h-8 rounded-xl text-xs"
                onClick={() => toast.success("Vault restored")}
              >
                Restore
              </Button>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

function BackupCard({
  icon: Icon,
  title,
  description,
  action,
  onClick,
  variant,
}: {
  icon: typeof DatabaseBackup;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  variant?: "secondary";
}) {
  return (
    <div className="vault-card p-5">
      <span className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <Button
        variant={variant}
        onClick={onClick}
        className="mt-4 h-11 w-full rounded-2xl font-semibold"
      >
        {action}
      </Button>
    </div>
  );
}
