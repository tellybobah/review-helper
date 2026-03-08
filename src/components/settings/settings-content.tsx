"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Language, Tone } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc/client";
import { LANGUAGES, TONES } from "@/lib/constants";

const languageLabelKeys: Record<Language, string> = {
  fr: "french",
  en: "english",
  auto: "auto",
};

const toneLabelKeys: Record<Tone, string> = {
  professional: "professional",
  friendly: "friendly",
  casual: "casual",
};

export function SettingsContent() {
  const t = useTranslations("settings");
  const { toast } = useToast();

  const { data: org, isLoading } = trpc.organization.getCurrent.useQuery();
  const utils = trpc.useUtils();

  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [languagePreference, setLanguagePreference] = useState<Language>("auto");
  const [tonePreference, setTonePreference] = useState<Tone>("friendly");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (org) {
      setName(org.name);
      setBusinessType(org.businessType ?? "");
      setReviewLink(org.reviewLink ?? "");
      setLanguagePreference(org.languagePreference);
      setTonePreference(org.tonePreference);
      setTimezone(org.timezone);
    }
  }, [org]);

  const updateMutation = trpc.organization.update.useMutation({
    onSuccess: () => {
      utils.organization.getCurrent.invalidate();
      toast({ title: t("saved") });
    },
    onError: () => {
      toast({ title: t("saveError"), variant: "destructive" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate({
      name: name.trim(),
      businessType: businessType.trim() || undefined,
      reviewLink: reviewLink.trim() || undefined,
      languagePreference,
      tonePreference,
      timezone: timezone.trim() || undefined,
    });
  }

  if (isLoading) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("businessName")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">{t("businessType")}</Label>
        <Input
          id="businessType"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder={t("businessTypePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reviewLink">{t("reviewLink")}</Label>
        <Input
          id="reviewLink"
          value={reviewLink}
          onChange={(e) => setReviewLink(e.target.value)}
          placeholder={t("reviewLinkPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("languagePreference")}</Label>
        <Select
          value={languagePreference}
          onValueChange={(v) => setLanguagePreference(v as Language)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {t(languageLabelKeys[lang])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("tonePreference")}</Label>
        <Select
          value={tonePreference}
          onValueChange={(v) => setTonePreference(v as Tone)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {t(toneLabelKeys[tone])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">{t("timezone")}</Label>
        <Input
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          placeholder={t("timezonePlaceholder")}
        />
      </div>

      <Button type="submit" disabled={!name.trim() || updateMutation.isPending}>
        {updateMutation.isPending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
