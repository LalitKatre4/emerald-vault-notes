import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";

import { PinDots, PinPad } from "@/components/vault/PinPad";
import { ConfirmationDialog } from "@/components/vault/ConfirmationDialog";
import { useVault } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lock")({
  head: () => ({
    meta: [
      { title: "Vault Locked — Private Notes Vault" },
      {
        name: "description",
        content: "Enter your PIN to unlock your private notes vault.",
      },
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
  const [biometricLoading, setBiometricLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !state.pin) {
      navigate({ to: "/setup" });
    }
  }, [ready, state.pin, navigate]);

  useEffect(() => {
    if (!ready || !state.pin) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, [ready, state.pin]);

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

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const onDigit = (d: string) => {
    if (pin.length >= 6) return;

    const next = (pin + d).slice(0, 6);

    setPin(next);
    setError("");

    if (state.pin && next.length === state.pin.length) {
      setTimeout(() => unlock(next), 120);
    }
  };

  const onKeyboardChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);

    setPin(digits);
    setError("");

    if (state.pin && digits.length === state.pin.length) {
      setTimeout(() => unlock(digits), 120);
    }
  };

  // REAL native biometric authentication
  const useBiometric = async () => {
    if (biometricLoading) return;

    setBiometricLoading(true);
    setError("");

    try {
      // First check whether biometric authentication is actually available.
      const info = await BiometricAuth.checkBiometry();

      if (!info.isAvailable) {
        setError(
          "Fingerprint authentication is not available. Please set up a fingerprint on your device.",
        );
        return;
      }

      // This opens the real Android biometric prompt.
      await BiometricAuth.authenticate({
        reason: "Authenticate to unlock your Private Notes Vault",
        cancelTitle: "Cancel",
        allowDeviceCredential: false,
        androidTitle: "Unlock Private Notes Vault",
        androidSubtitle: "Use your fingerprint to unlock your vault",
        androidConfirmationRequired: false,
      });

      // IMPORTANT:
      // Only unlock AFTER authenticate() succeeds.
      setLocked(false);
      setPin("");
      setError("");

      toast.success("Biometric authentication successful");
      navigate({ to: "/home" });
    } catch (error) {
      console.log("Biometric authentication failed:", error);

      // Authentication failed/cancelled.
      // DO NOT unlock the vault.
      setError("Fingerprint authentication failed or was cancelled.");
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-12"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={pin}
        onChange={(e) => onKeyboardChange(e.target.value)}
        aria-label="PIN"
        className="absolute left-[-9999px] h-1 w-1 opacity-0"
      />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div
          className={cn(
            "rounded-3xl border border-primary/30 bg-card p-6",
            error && "animate-shake",
          )}
        >
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mt-6 text-xl font-semibold">Vault Locked</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter your PIN to continue
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="mt-7 cursor-pointer"
          aria-label="Enter PIN"
        >
          <PinDots
            length={pin.length}
            size={state.pin?.length ?? 4}
          />
        </button>

        <p className="mt-3 h-5 text-sm text-destructive">
          {error &&
            `${error}${attempts > 1 ? ` (${attempts} failed attempts)` : ""}`}
        </p>
      </div>

      <div className="w-full max-w-xs">
        <PinPad
          onDigit={onDigit}
          onBackspace={() => {
            setPin((p) => p.slice(0, -1));
            setError("");
            inputRef.current?.focus();
          }}
          onBiometric={useBiometric}
        />

        <button
          type="button"
          onClick={useBiometric}
          disabled={biometricLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary disabled:opacity-50"
        >
          <Fingerprint className="h-4 w-4" />
          {biometricLoading ? "Waiting for fingerprint..." : "Use fingerprint"}
        </button>

        <button
          type="button"
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