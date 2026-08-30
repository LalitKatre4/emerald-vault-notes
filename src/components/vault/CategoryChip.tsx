import { cn } from "@/lib/utils";

export function CategoryChip({
  name,
  active,
  onClick,
  className,
}: {
  name: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border bg-secondary text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {name}
    </Comp>
  );
}
