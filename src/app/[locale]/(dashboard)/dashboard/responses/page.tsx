import { useTranslations } from "next-intl";

export default function ResponsesPage() {
  const t = useTranslations("responses");

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
      {/* TODO: Add responses list */}
    </div>
  );
}
