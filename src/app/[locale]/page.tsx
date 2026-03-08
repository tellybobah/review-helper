import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("common.appName")}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t("landing.tagline")}
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">{t("landing.getStarted")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">{t("landing.signIn")}</Link>
        </Button>
      </div>
    </div>
  );
}
