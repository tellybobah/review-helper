import { getTranslations } from "next-intl/server";
import { getServerCaller } from "@/lib/trpc/server";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  let stats = {
    totalReviews: 0,
    averageRating: 0,
    pendingCount: 0,
    draftedCount: 0,
  };

  try {
    const caller = await getServerCaller();
    stats = await caller.review.stats();
  } catch {
    // User may not have an org yet — show empty state
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("description")}</p>
      </div>
      <DashboardStats {...stats} />
    </div>
  );
}
