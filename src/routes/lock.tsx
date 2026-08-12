import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PinDots, PinPad } from "@/components/vault/PinPad";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { useVault } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lock")({
  head: () => ({
    meta: [
      { title: "Vault Locked — Private Notes Vault" },
      { name: "description", content: "Enter your PIN to unlock your private notes vault." },
      { property: "og:title", content: "Vault Locked" },
      { property: "og:description", content: "Enter your PIN to continue." },
    ],
  }),
  component: LockScreen,
});

function LockScreen() {
  const navigate = useNavigate();
  const { state, setLocked, ready, reset } = useVault();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    if (ready && !state.pin) navigate({ to: "/setup" });
  }, [ready, state.pin, navigate]);

  const unlock = (value: string) => {
    if (value === state.pin) {
      setLocked(false);
      setPin("");
      setError("");
      navigate({ to: "/home" });
    } else {
      setAttempts((a) => a + 1);
      setError("Incorrect PIN. Try again.");
      setPin("");
    }
  };

  const onDigit = (d: string) => {
    const next = (pin + d).slice(0, 6);
    setPin(next);
    setError("");
    if (state.pin && next.length === state.pin.length) setTimeout(() => unlock(next), 120);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className={cn("rounded-3xl border border-primary/30 bg-card p-6", error && "animate-shake")}>
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-6 text-xl font-semibold">Vault Locked</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your PIN to continue</p>
        <div className="mt-7">
          <PinDots length={pin.length} size={state.pin?.length ?? 4} />
        </div>
        <p className="mt-3 h-5 text-sm text-destructive">
          {error && `${error}${attempts > 1 ? ` (${attempts} failed attempts)` : ""}`}
        </p>
      </div>

      <div className="w-full max-w-xs">
        <PinPad
          onDigit={onDigit}
          onBackspace={() => setPin((p) => p.slice(0, -1))}
          onBiometric={() => {
            toast.success("Biometric verified");
            setLocked(false);
            navigate({ to: "/home" });
          }}
        />
        <button
          onClick={() => {
            toast.success("Biometric verified");
            setLocked(false);
            navigate({ to: "/home" });
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary"
        >
          <Fingerprint className="h-4 w-4" /> Use fingerprint
        </button>
        <button
          onClick={() => setForgot(true)}
          className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Forgot PIN?
        </button>
      </div>

      <ConfirmationDialog
        open={forgot}
        onOpenChange={setForgot}
        title="Reset your vault?"
        description="For privacy, a forgotten PIN can only be resolved by resetting the vault. Notes in this prototype will be restored to samples."
        confirmLabel="Reset vault"
        onConfirm={() => {
          reset();
          setLocked(false);
          navigate({ to: "/setup" });
        }}
      />
    </main>
  );
}
