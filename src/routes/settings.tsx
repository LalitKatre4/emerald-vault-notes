import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  Crown,
  DatabaseBackup,
  Download,
  Eye,
  Fingerprint,
  FileText,
  FolderOpen,
  Globe,
  Info,
  KeyRound,
  Lock,
  Moon,
  ScanEye,
  ShieldCheck,
  Timer,
  Trash2,
  Upload,
  ArrowDownUp,
  FileLock,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Private Notes Vault" },
      { name: "description", content: "Control security, privacy, data and appearance settings." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Control your vault's security and privacy." },
    ],
  }),
  component: SettingsScreen,
});

const autoLockOptions = ["Immediately", "1 minute", "5 minutes", "15 minutes", "Never"];

function SettingsScreen() {
  const navigate = useNavigate();
  const { state, updateSettings, setLocked } = useVault();
  const s = state.settings;
  const [about, setAbout] = useState<string | null>(null);

  const selectControl = (value: string, options: string[], onChange: (v: string) => void) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-32 rounded-lg text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <AppShell>
      <ScreenHeader title="Settings" subtitle="Your thoughts. Your privacy." />

      <SettingsSection title="Security">
        <SettingsItem icon={KeyRound} label="Change PIN" to="/change-pin" />
        <SettingsItem
          icon={Fingerprint}
          label="Biometric Unlock"
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
          label="Auto Lock"
          control={selectControl(s.autoLock, autoLockOptions, (v) =>
            updateSettings({ autoLock: v }),
          )}
        />
        <SettingsItem icon={ShieldCheck} label="Security Center" to="/security" />
        <SettingsItem
          icon={Lock}
          label="Lock Vault Now"
          onClick={() => {
            setLocked(true);
            navigate({ to: "/lock" });
          }}
        />
      </SettingsSection>

      <SettingsSection title="Privacy">
        <SettingsItem
          icon={Eye}
          label="Hide note previews"
          control={
            <Switch
              checked={s.hidePreviews}
              onCheckedChange={(v) => updateSettings({ hidePreviews: v })}
            />
          }
        />
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
          label="Hide app content in recents"
          control={
            <Switch
              checked={s.hideInRecents}
              onCheckedChange={(v) => updateSettings({ hideInRecents: v })}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Notes">
        <SettingsItem
          icon={FolderOpen}
          label="Default category"
          control={selectControl(
            s.defaultCategory,
            state.categories.map((c) => c.name),
            (v) => updateSettings({ defaultCategory: v }),
          )}
        />
        <SettingsItem
          icon={FileText}
          label="Default note view"
          control={selectControl(s.defaultView === "list" ? "List" : "Grid", ["List", "Grid"], (v) =>
            updateSettings({ defaultView: v === "List" ? "list" : "grid" }),
          )}
        />
        <SettingsItem
          icon={ArrowDownUp}
          label="Sort notes"
          control={selectControl(
            s.sortBy === "updated" ? "Updated" : s.sortBy === "created" ? "Created" : "A–Z",
            ["Updated", "Created", "A–Z"],
            (v) =>
              updateSettings({
                sortBy: v === "Updated" ? "updated" : v === "Created" ? "created" : "az",
              }),
          )}
        />
        <SettingsItem icon={FolderOpen} label="Categories" to="/categories" />
        <SettingsItem icon={Trash2} label="Recently Deleted" to="/trash" />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsItem icon={DatabaseBackup} label="Backup & Restore" to="/backup" />
        <SettingsItem
          icon={Download}
          label="Export Notes"
          onClick={() => toast.success("Notes exported securely")}
        />
        <SettingsItem
          icon={Upload}
          label="Import Notes"
          onClick={() => toast.success("Import ready — choose a vault file")}
        />
      </SettingsSection>

      <SettingsSection title="App">
        <SettingsItem
          icon={Moon}
          label="Dark Mode"
          control={
            <Switch checked={s.darkMode} onCheckedChange={(v) => updateSettings({ darkMode: v })} />
          }
        />
        <SettingsItem
          icon={Bell}
          label="Notifications"
          control={
            <Switch
              checked={s.notifications}
              onCheckedChange={(v) => updateSettings({ notifications: v })}
            />
          }
        />
        <SettingsItem
          icon={Globe}
          label="Language"
          control={selectControl(s.language, ["English", "Hindi", "Spanish", "German"], (v) =>
            updateSettings({ language: v }),
          )}
        />
        <SettingsItem icon={Crown} label="Private Notes Premium" to="/premium" />
      </SettingsSection>

            <SettingsSection title="About">
        <SettingsItem
          icon={FileLock}
          label="Privacy Policy"
          onClick={() => {
            window.open(
              "https://sites.google.com/view/notes-private-policy/home",
              "_blank",
              "noopener,noreferrer"
            );
          }}
        />

        <SettingsItem
          icon={Scale}
          label="Terms of Service"
          onClick={() =>
            setAbout("Use Private Notes Vault responsibly and keep your PIN safe.")
          }
        />

        <SettingsItem
          icon={Info}
          label="About Private Notes Vault"
          onClick={() =>
            setAbout(
              "A private place for your thoughts, protected by a PIN and biometrics."
            )
          }
        />

        <SettingsItem
          icon={Info}
          label="App Version"
          control={
            <span className="text-xs text-muted-foreground">1.0.0</span>
          }
        />
      </SettingsSection>

      <Dialog
        open={Boolean(about)}
        onOpenChange={(v) => !v && setAbout(null)}
      >
        <DialogContent className="max-w-[22rem] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Private Notes Vault</DialogTitle>
            <DialogDescription>{about}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
