import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useVault } from "@/lib/vault-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Private Notes Vault — Your thoughts. Your privacy." },
      {
        name: "description",
        content:
          "A private, PIN-protected notes vault with categories, favorites, trash and biometric unlock.",
      },
      { property: "og:title", content: "Private Notes Vault" },
      { property: "og:description", content: "Your thoughts. Your privacy." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { ready, state } = useVault();

useEffect(() => {
  if (!ready) return;

  navigate({
    to: state.pin ? "/lock" : "/setup",
    replace: true,
  });
}, [ready, state.pin, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="animate-fade-up flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl" />
          <div className="relative rounded-3xl border border-primary/30 bg-card p-6 shadow-[var(--shadow-glow)]">
            <ShieldCheck className="h-12 w-12 text-primary" />
            <Lock className="absolute bottom-4 right-4 h-4 w-4 text-gold" />
          </div>
        </div>
        <h1 className="mt-7 text-2xl font-semibold tracking-tight">Private Notes Vault</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your thoughts. Your privacy.</p>
        <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          Securing vault
        </p>
      </div>
    </main>
  );
}
