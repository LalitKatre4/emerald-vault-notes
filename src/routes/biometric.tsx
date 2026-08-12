import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/biometric")({
  head: () => ({
    meta: [
      { title: "Biometric Unlock — Private Notes Vault" },
      { name: "description", content: "Use your fingerprint to unlock your private notes faster." },
      { property: "og:title", content: "Biometric Unlock" },
      { property: "og:description", content: "Unlock your vault faster." },
    ],
  }),
  component: Biometric,
});

function Biometric() {
  const navigate = useNavigate();
  const { state, updateSettings } = useVault();

  return (
    <AppShell>
      <ScreenHeader title="Biometric Unlock" subtitle="Faster access, same privacy" back="/security" />

      <div className="vault-card flex flex-col items-center p-8 text-center">
        <div className="rounded-full border border-primary/30 bg-primary/10 p-6 text-primary">
          <Fingerprint className="h-16 w-16" />
        </div>
        <h2 className="mt-6 text-lg font-semibold">Unlock your vault faster</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Skip the PIN pad while keeping your notes protected.
        </p>
      </div>

      <div className="vault-card mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
        <span className="min-w-0 truncate text-sm font-medium">Use biometric authentication</span>
        <Switch
          checked={state.settings.biometric}
          onCheckedChange={(v) => updateSettings({ biometric: v })}
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Your biometric data is handled by your device's secure authentication system. Private Notes
        Vault never stores or sees it.
      </p>

      <Button
        className="mt-5 h-12 w-full rounded-2xl font-semibold"
        onClick={() => {
          updateSettings({ biometric: true });
          toast.success("Biometric unlock enabled");
          navigate({ to: "/security" });
        }}
      >
        Enable
      </Button>
    </AppShell>
  );
}
