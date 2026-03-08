import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  // next-intl supports useTranslations in not-found.tsx
  // as a server-compatible hook when wrapped by NextIntlClientProvider
  const t = useTranslations("error");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">{t("notFoundTitle")}</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        {t("notFoundDescription")}
      </p>
      <Link
        href={ROUTES.dashboard}
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
