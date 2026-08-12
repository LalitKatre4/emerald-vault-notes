import { Delete, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

export function PinDots({ length, size = 6 }: { length: number; size?: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: size }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-3 w-3 rounded-full border transition-all",
            i < length ? "scale-110 border-primary bg-primary" : "border-border bg-transparent",
          )}
        />
      ))}
    </div>
  );
}

export function PinPad({
  onDigit,
  onBackspace,
  onBiometric,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onBiometric?: () => void;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <div className="mx-auto grid max-w-xs grid-cols-3 gap-3">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onDigit(k)}
          className="rounded-2xl border border-border bg-card py-4 text-xl font-medium transition-colors active:bg-accent"
        >
          {k}
        </button>
      ))}
      <button
        onClick={onBiometric}
        aria-label="Use fingerprint"
        className="flex items-center justify-center rounded-2xl border border-border bg-card py-4 text-primary transition-colors active:bg-accent"
      >
        <Fingerprint className="h-6 w-6" />
      </button>
      <button
        onClick={() => onDigit("0")}
        className="rounded-2xl border border-border bg-card py-4 text-xl font-medium transition-colors active:bg-accent"
      >
        0
      </button>
      <button
        onClick={onBackspace}
        aria-label="Backspace"
        className="flex items-center justify-center rounded-2xl border border-border bg-card py-4 text-muted-foreground transition-colors active:bg-accent"
      >
        <Delete className="h-6 w-6" />
      </button>
    </div>
  );
}
