import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("auth.resetPassword")}</CardTitle>
        <CardDescription>
          {t("auth.resetPasswordDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {searchParams.error === "reset" && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {t("auth.errorReset")}
          </div>
        )}
        {searchParams.message === "check-email" && (
          <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm text-primary">
            {t("auth.checkEmailReset")}
          </div>
        )}

        <form action={forgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("common.emailPlaceholder")}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t("auth.sendResetLink")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("auth.rememberPassword")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            {t("auth.signIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
