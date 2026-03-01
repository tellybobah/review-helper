"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  {
    titleKey: "dashboard" as const,
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "reviews" as const,
    href: "/dashboard/reviews",
    icon: Star,
  },
  {
    titleKey: "responses" as const,
    href: "/dashboard/responses",
    icon: MessageSquare,
  },
  {
    titleKey: "analytics" as const,
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    titleKey: "settings" as const,
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.titleKey)}
          </Link>
        );
      })}
    </nav>
  );
}
