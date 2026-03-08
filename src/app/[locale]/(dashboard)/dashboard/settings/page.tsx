import { getTranslations } from "next-intl/server";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
      <SettingsContent />
    </div>
  );
}
