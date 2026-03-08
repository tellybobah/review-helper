"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ResponseStatus, Tone, Language } from "@prisma/client";
import { Check, SkipForward, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "@/components/reviews/star-rating";
import { trpc } from "@/lib/trpc/client";
import type { Review } from "@prisma/client";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusBadgeVariant: Record<ResponseStatus, BadgeVariant> = {
  [ResponseStatus.pending]: "outline",
  [ResponseStatus.drafted]: "secondary",
  [ResponseStatus.approved]: "default",
  [ResponseStatus.posted]: "default",
  [ResponseStatus.skipped]: "destructive",
};

interface ResponseCardProps {
  review: Review;
}

export function ResponseCard({ review }: ResponseCardProps) {
  const t = useTranslations("responses");
  const ts = useTranslations("status");
  const tt = useTranslations("tone");

  const [responseText, setResponseText] = useState(
    review.finalResponseText ?? ""
  );
  const [regenerateTone, setRegenerateTone] = useState<Tone>(Tone.friendly);
  const [regenerateLanguage, setRegenerateLanguage] = useState<Language>(
    (review.reviewLanguage as Language) ?? Language.fr
  );

  const utils = trpc.useUtils();

  const updateMutation = trpc.review.updateResponse.useMutation({
    onSuccess: () => {
      utils.review.list.invalidate();
      utils.review.stats.invalidate();
    },
  });

  const regenerateMutation = trpc.response.regenerate.useMutation({
    onSuccess: (data) => {
      setResponseText(data.finalResponseText ?? "");
      utils.review.list.invalidate();
    },
  });

  const isDrafted = review.responseStatus === ResponseStatus.drafted;

  function handleApprove() {
    updateMutation.mutate({
      id: review.id,
      finalResponseText: responseText,
      responseStatus: ResponseStatus.approved,
    });
  }

  function handleSkip() {
    updateMutation.mutate({
      id: review.id,
      finalResponseText: responseText || review.finalResponseText || "",
      responseStatus: ResponseStatus.skipped,
    });
  }

  function handleRegenerate() {
    regenerateMutation.mutate({
      reviewId: review.id,
      tone: regenerateTone,
      language: regenerateLanguage,
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{review.reviewerName}</span>
            <StarRating rating={review.starRating} />
            <Badge variant={statusBadgeVariant[review.responseStatus]}>
              {ts(review.responseStatus)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {review.reviewText && (
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {t("originalReview")}
            </p>
            <p className="text-sm">{review.reviewText}</p>
          </div>
        )}

        {isDrafted ? (
          <Textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder={t("editResponse")}
            rows={4}
          />
        ) : (
          <div className="rounded-md border p-3">
            <p className="text-sm">{review.finalResponseText}</p>
          </div>
        )}
      </CardContent>

      {isDrafted && (
        <CardFooter className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={updateMutation.isPending || !responseText.trim()}
          >
            <Check className="mr-1 h-3 w-3" />
            {t("approve")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSkip}
            disabled={updateMutation.isPending}
          >
            <SkipForward className="mr-1 h-3 w-3" />
            {t("skip")}
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Select
              value={regenerateTone}
              onValueChange={(v) => setRegenerateTone(v as Tone)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Tone.professional}>
                  {tt("professional")}
                </SelectItem>
                <SelectItem value={Tone.friendly}>
                  {tt("friendly")}
                </SelectItem>
                <SelectItem value={Tone.casual}>{tt("casual")}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={regenerateLanguage}
              onValueChange={(v) => setRegenerateLanguage(v as Language)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Language.fr}>FR</SelectItem>
                <SelectItem value={Language.en}>EN</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleRegenerate}
              disabled={regenerateMutation.isPending}
            >
              <RefreshCw
                className={`mr-1 h-3 w-3 ${
                  regenerateMutation.isPending ? "animate-spin" : ""
                }`}
              />
              {regenerateMutation.isPending
                ? t("regenerating")
                : t("regenerate")}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
