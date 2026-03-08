import { getTranslations } from "next-intl/server";
import { AnalyticsContent } from "@/components/analytics/analytics-content";

export default async function AnalyticsPage() {
  const t = await getTranslations("analytics");

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
      <AnalyticsContent />
    </div>
  );
}
