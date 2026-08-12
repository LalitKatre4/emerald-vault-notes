import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/change-pin")({
  head: () => ({
    meta: [
      { title: "Change PIN — Private Notes Vault" },
      { name: "description", content: "Update the PIN that protects your private notes vault." },
      { property: "og:title", content: "Change PIN" },
      { property: "og:description", content: "Update your vault PIN." },
    ],
  }),
  component: ChangePin,
});

function ChangePin() {
  const navigate = useNavigate();
  const { state, setPin } = useVault();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (current !== state.pin) return setError("Incorrect current PIN.");
    if (next.length < 4) return setError("PIN too short — use at least 4 digits.");
    if (next !== confirm) return setError("PINs don't match.");
    setPin(next);
    setError("");
    toast.success("PIN changed successfully.");
    navigate({ to: "/security" });
  };

  const field = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="password"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="h-12 rounded-2xl tracking-[0.4em]"
      />
    </div>
  );

  return (
    <AppShell>
      <ScreenHeader title="Change PIN" subtitle="Keep your vault secure" back="/security" />

      <div className="vault-card space-y-4 p-5">
        <span className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
          <KeyRound className="h-6 w-6" />
        </span>
        {field("current", "Current PIN", current, setCurrent)}
        {field("new", "New PIN", next, setNext)}
        {field("confirm", "Confirm New PIN", confirm, setConfirm)}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={submit} className="h-12 w-full rounded-2xl font-semibold">
          Change PIN
        </Button>
      </div>
    </AppShell>
  );
}
