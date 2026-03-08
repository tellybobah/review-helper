"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, CalendarDays, Percent, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardsProps {
  totalReviews: number;
  thisMonthCount: number;
  responseRate: number;
  avgResponseTime: number;
}

export function StatCards({
  totalReviews,
  thisMonthCount,
  responseRate,
  avgResponseTime,
}: StatCardsProps) {
  const t = useTranslations("analytics");

  const stats = [
    {
      label: t("totalReviews"),
      value: totalReviews,
      icon: MessageSquare,
    },
    {
      label: t("thisMonth"),
      value: thisMonthCount,
      icon: CalendarDays,
    },
    {
      label: t("responseRate"),
      value: `${responseRate}%`,
      icon: Percent,
    },
    {
      label: t("avgResponseTime"),
      value: `${avgResponseTime} ${t("hours")}`,
      icon: Clock,
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
