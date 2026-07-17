import {
  BookOpenCheck,
  Download,
  Home,
  Info,
  Scale,
  MessageCircle,
  GraduationCap,
  Radio,
  Puzzle,
  Settings,
  Wrench,
  type LucideIcon
} from "@lucide/svelte";

export type RouteId =
  | "home"
  | "downloads"
  | "tools"
  | "channels"
  | "courses"
  | "learning"
  | "telegram"
  | "settings"
  | "plugins"
  | "legal"
  | "about";

export interface NavItem {
  id: RouteId;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "channels", label: "Channels", icon: Radio },
  { id: "courses", label: "Courses", icon: GraduationCap },
  { id: "learning", label: "Learning", icon: BookOpenCheck },
  { id: "telegram", label: "Telegram", icon: MessageCircle },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "plugins", label: "Plugins", icon: Puzzle },
  { id: "legal", label: "Legal", icon: Scale },
  { id: "about", label: "About", icon: Info }
];

export function isRouteId(value: string): value is RouteId {
  return navItems.some((item) => item.id === value);
}
