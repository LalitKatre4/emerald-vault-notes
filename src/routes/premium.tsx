import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { AppShell, ScreenHeader } from "@/components/vault/AppShell";
import { Button } from "@/components/ui/button";
import { useVault } from "@/lib/vault-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — Private Notes Vault" },
      { name: "description", content: "Unlock secure folders, advanced encryption and backups." },
      { property: "og:title", content: "Private Notes Premium" },
      { property: "og:description", content: "More privacy. More control." },
    ],
  }),
  component: Premium,
});

const features = [
  "Remove Ads",
  "Unlimited Notes",
  "Secure Folders",
  "Advanced Encryption",
  "Backup & Restore",
  "Export & Import",
  "Additional Security Options",
  "Custom Vault Themes",
];

function Premium() {
  const { state, updateSettings } = useVault();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  return (
    <AppShell>
      <ScreenHeader title="Private Notes Premium" subtitle="More privacy. More control." back="/settings" />

      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-card to-primary/10 p-6 text-center">
        <div className="mx-auto w-fit rounded-2xl bg-gold/20 p-3 text-gold">
          <Crown className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">
          {state.settings.premium ? "Premium is active" : "Upgrade your vault"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Stronger privacy tools, no limits, no distractions.
        </p>
      </div>

      <div className="mt-5 grid gap-2">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <span className="rounded-full bg-primary/15 p-1 text-primary">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <PlanCard
          label="Monthly"
          price="₹49"
          period="/ month"
          active={plan === "monthly"}
          onClick={() => setPlan("monthly")}
        />
        <PlanCard
          label="Yearly"
          price="₹299"
          period="/ year"
          badge="Best Value"
          active={plan === "yearly"}
          onClick={() => setPlan("yearly")}
        />
      </div>

      <Button
        className="mt-5 h-12 w-full rounded-2xl bg-gold font-semibold text-gold-foreground hover:bg-gold/90"
        onClick={() => {
          updateSettings({ premium: true });
          toast.success(`Premium activated — ${plan} plan`);
        }}
      >
        Start Premium
      </Button>
      <button
        onClick={() => toast("No previous purchase found")}
        className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Restore Purchase
      </button>
    </AppShell>
  );
}

function PlanCard({
  label,
  price,
  period,
  badge,
  active,
  onClick,
}: {
  label: string;
  price: string;
  period: string;
  badge?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-3xl border p-4 text-left transition-colors",
        active ? "border-primary bg-primary/10" : "border-border bg-card",
      )}
    >
      {badge && (
        <span className="absolute -top-2 right-3 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-gold-foreground">
          {badge}
        </span>
      )}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{price}</p>
      <p className="text-xs text-muted-foreground">{period}</p>
    </button>
  );
}
