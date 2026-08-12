import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fingerprint, KeyRound, Lock, ScanEye, ShieldCheck, Timer, FileLock } from "lucide-react";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { SettingsItem, SettingsSection } from "@/components/vault/SettingsItem";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — Private Notes Vault" },
      { name: "description", content: "PIN, biometrics, auto-lock and privacy protections." },
      { property: "og:title", content: "Security" },
      { property: "og:description", content: "Vault protection active." },
    ],
  }),
  component: SecurityScreen,
});

function SecurityScreen() {
  const navigate = useNavigate();
  const { state, updateSettings, setLocked } = useVault();
  const s = state.settings;

  return (
    <AppShell>
      <ScreenHeader title="Security" subtitle="Protection for your vault" back="/settings" />

      <div className="mb-6 flex items-center gap-3 rounded-3xl border border-primary/30 bg-primary/10 p-4">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Vault Protection Active</p>
          <p className="truncate text-xs text-muted-foreground">
            PIN protection and auto-lock are enabled
          </p>
        </div>
      </div>

      <SettingsSection title="Access">
        <SettingsItem icon={KeyRound} label="Change PIN" to="/change-pin" />
        <SettingsItem
          icon={Fingerprint}
          label="Enable biometric unlock"
          to="/biometric"
          control={
            <Switch
              checked={s.biometric}
              onCheckedChange={(v) => updateSettings({ biometric: v })}
            />
          }
        />
        <SettingsItem
          icon={Timer}
          label="Auto-lock timer"
          control={
            <Select value={s.autoLock} onValueChange={(v) => updateSettings({ autoLock: v })}>
              <SelectTrigger className="h-8 w-32 rounded-lg text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Immediately", "1 minute", "5 minutes", "15 minutes", "Never"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <SettingsItem
          icon={Lock}
          label="Lock vault now"
          onClick={() => {
            setLocked(true);
            navigate({ to: "/lock" });
          }}
        />
      </SettingsSection>

      <SettingsSection title="Privacy shields">
        <SettingsItem
          icon={ScanEye}
          label="Screenshot protection"
          control={
            <Switch
              checked={s.screenshotProtection}
              onCheckedChange={(v) => updateSettings({ screenshotProtection: v })}
            />
          }
        />
        <SettingsItem
          icon={FileLock}
          label="Hide content in recent apps"
          control={
            <Switch
              checked={s.hideInRecents}
              onCheckedChange={(v) => updateSettings({ hideInRecents: v })}
            />
          }
        />
      </SettingsSection>

      <div className="vault-card flex gap-3 p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your vault is designed to keep private notes protected. Keep your PIN private and enable
          auto-lock for the strongest protection.
        </p>
      </div>
    </AppShell>
  );
}
