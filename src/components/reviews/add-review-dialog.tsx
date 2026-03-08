"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "./star-rating";
import { trpc } from "@/lib/trpc/client";

export function AddReviewDialog() {
  const t = useTranslations("reviews");
  const [open, setOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [language, setLanguage] = useState<"fr" | "en">("fr");

  const utils = trpc.useUtils();
  const createMutation = trpc.review.create.useMutation({
    onSuccess: () => {
      utils.review.list.invalidate();
      utils.review.stats.invalidate();
      setOpen(false);
      resetForm();
    },
  });

  function resetForm() {
    setReviewerName("");
    setStarRating(0);
    setReviewText("");
    setLanguage("fr");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewerName.trim() || starRating === 0) return;

    createMutation.mutate({
      reviewerName: reviewerName.trim(),
      starRating,
      reviewText: reviewText.trim() || undefined,
      reviewLanguage: language,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("addReview")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addReviewTitle")}</DialogTitle>
          <DialogDescription>{t("addReviewDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reviewerName">{t("reviewerName")}</Label>
            <Input
              id="reviewerName"
              placeholder={t("reviewerNamePlaceholder")}
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t("starRating")}</Label>
            <StarRating
              rating={starRating}
              interactive
              onRate={setStarRating}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewText">{t("reviewTextLabel")}</Label>
            <Textarea
              id="reviewText"
              placeholder={t("reviewTextPlaceholder")}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("language")}</Label>
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v as "fr" | "en")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">{t("french")}</SelectItem>
                <SelectItem value="en">{t("english")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel", { ns: "common" })}
            </Button>
            <Button
              type="submit"
              disabled={
                !reviewerName.trim() ||
                starRating === 0 ||
                createMutation.isPending
              }
            >
              {createMutation.isPending
                ? t("generating")
                : t("addReview")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
