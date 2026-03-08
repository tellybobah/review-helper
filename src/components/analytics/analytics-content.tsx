"use client";

import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { StatCards } from "./stat-cards";
import { RatingDistribution } from "./rating-distribution";
import { ReviewTrend } from "./review-trend";

export function AnalyticsContent() {
  const t = useTranslations("analytics");
  const { data, isLoading } = trpc.review.analytics.useQuery();

  if (isLoading) return null;

  if (!data || data.totalReviews === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{t("noData")}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("noDataDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <StatCards
        totalReviews={data.totalReviews}
        thisMonthCount={data.thisMonthCount}
        responseRate={data.responseRate}
        avgResponseTime={data.avgResponseTime}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <RatingDistribution data={data.ratingDistribution} />
        <ReviewTrend data={data.monthlyTrend} />
      </div>
    </div>
  );
}
