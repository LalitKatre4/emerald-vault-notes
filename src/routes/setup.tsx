import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Fingerprint, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Secure your vault — Private Notes Vault" },
      { name: "description", content: "Create a PIN to protect your private notes vault." },
      { property: "og:title", content: "Secure your vault" },
      { property: "og:description", content: "Create a PIN to protect your vault." },
    ],
  }),
  component: SetupScreen,
});

function SetupScreen() {
  const navigate = useNavigate();
  const { setPin, setLocked, updateSettings, state } = useVault();
  const [pin, setPinValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [biometric, setBiometric] = useState(state.settings.biometric);
  const [error, setError] = useState("");

  const submit = () => {
    if (pin.length < 4) return setError("PIN must be at least 4 digits.");
    if (pin !== confirm) return setError("PINs don't match.");
    setPin(pin);
    updateSettings({ biometric });
    setLocked(false);
    toast.success("Vault secured");
    navigate({ to: "/home" });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-5 py-10">
      <div className="animate-fade-up">
        <div className="w-fit rounded-2xl bg-primary/10 p-3 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Secure your private notes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a PIN to protect your vault.</p>

        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <div className="relative">
              <Input
                id="pin"
                inputMode="numeric"
                type={show ? "text" : "password"}
                value={pin}
                onChange={(e) => setPinValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 4–6 digits"
                className="h-12 rounded-2xl pr-11 tracking-[0.4em]"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide PIN" : "Show PIN"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm PIN</Label>
            <Input
              id="confirm"
              inputMode="numeric"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Re-enter PIN"
              className="h-12 rounded-2xl tracking-[0.4em]"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="vault-card grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <Fingerprint className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">Enable biometric unlock</span>
              <span className="block text-xs text-muted-foreground">Unlock faster next time</span>
            </span>
            <Switch checked={biometric} onCheckedChange={setBiometric} />
          </div>

          <Button onClick={submit} className="h-12 w-full rounded-2xl text-base font-semibold">
            Continue
          </Button>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            Your notes stay private and are protected by your vault.
          </p>
        </div>
      </div>
    </main>
  );
}
