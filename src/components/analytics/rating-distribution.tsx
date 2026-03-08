"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const barColors: Record<number, string> = {
  5: "bg-green-500",
  4: "bg-lime-500",
  3: "bg-yellow-500",
  2: "bg-orange-500",
  1: "bg-red-500",
};

interface RatingDistributionProps {
  data: { star: number; count: number }[];
}

export function RatingDistribution({ data }: RatingDistributionProps) {
  const t = useTranslations("analytics");
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("ratingDistribution")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const item = data.find((d) => d.star === star);
            const count = item?.count ?? 0;
            const pct = (count / maxCount) * 100;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-12 text-right text-sm text-muted-foreground">
                  {star} {star === 1 ? t("oneStar") : t("stars")}
                </span>
                <div className="flex-1">
                  <div className="h-6 w-full rounded-sm bg-muted">
                    <div
                      className={`h-full rounded-sm ${barColors[star]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right text-sm font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
