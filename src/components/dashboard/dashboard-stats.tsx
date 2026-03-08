"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, Star, Clock, FileEdit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";

interface DashboardStatsProps {
  totalReviews: number;
  averageRating: number;
  pendingCount: number;
  draftedCount: number;
}

export function DashboardStats({
  totalReviews,
  averageRating,
  pendingCount,
  draftedCount,
}: DashboardStatsProps) {
  const t = useTranslations("dashboard");

  if (totalReviews === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{t("emptyTitle")}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
        <Link
          href={ROUTES.reviews}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("addFirstReview")}
        </Link>
      </div>
    );
  }

  const stats = [
    {
      label: t("totalReviews"),
      value: totalReviews,
      icon: MessageSquare,
    },
    {
      label: t("averageRating"),
      value: averageRating.toFixed(1),
      icon: Star,
    },
    {
      label: t("pendingReviews"),
      value: pendingCount,
      icon: Clock,
    },
    {
      label: t("draftedResponses"),
      value: draftedCount,
      icon: FileEdit,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
