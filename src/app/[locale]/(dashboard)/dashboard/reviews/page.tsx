import { useTranslations } from "next-intl";

export default function ReviewsPage() {
  const t = useTranslations("reviews");

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
      {/* TODO: Add reviews list */}
    </div>
  );
}
