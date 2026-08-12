import {
  Briefcase,
  Star,
  Lightbulb,
  Plane,
  User,
  Folder,
  Heart,
  BookOpen,
  Home,
  Wallet,
  Shield,
  Key,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  user: User,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
  star: Star,
  plane: Plane,
  folder: Folder,
  heart: Heart,
  book: BookOpen,
  home: Home,
  wallet: Wallet,
  shield: Shield,
  key: Key,
};

export const iconOptions = Object.keys(categoryIcons);

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = categoryIcons[name] ?? Folder;
  return <Icon className={className} />;
}
