"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReviewTrendProps {
  data: { month: string; count: number }[];
}

export function ReviewTrend({ data }: ReviewTrendProps) {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  function formatMonth(yyyyMm: string) {
    const [year, month] = yyyyMm.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString(locale, { month: "short" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("reviewTrend")}</CardTitle>
        <CardDescription>{t("lastSixMonths")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-end gap-2">
          {data.map((item) => {
            const heightPct = (item.count / maxCount) * 100;
            return (
              <div
                key={item.month}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-xs font-medium">{item.count}</span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-sm bg-primary"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatMonth(item.month)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
