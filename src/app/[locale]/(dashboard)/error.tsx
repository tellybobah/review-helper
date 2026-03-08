"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <p className="mt-2 max-w-md text-muted-foreground">{t("description")}</p>
      <Button onClick={reset} className="mt-6">
        {t("tryAgain")}
      </Button>
    </div>
  );
}
