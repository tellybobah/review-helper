import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const fullName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-muted/30 lg:flex">
        <div className="p-6">
          <span className="text-lg font-bold">ReviewBoost</span>
        </div>
        <div className="flex-1">
          <SidebarNav />
        </div>
        <div className="border-t p-3">
          <UserMenu email={user.email || ""} fullName={fullName} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <div className="lg:hidden">
            <MobileNav />
          </div>
          <span className="font-bold lg:hidden">ReviewBoost</span>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
