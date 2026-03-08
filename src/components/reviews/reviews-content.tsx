"use client";

import { useTranslations } from "next-intl";
import { ResponseStatus } from "@prisma/client";
import { Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "./star-rating";
import { AddReviewDialog } from "./add-review-dialog";
import { trpc } from "@/lib/trpc/client";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusBadgeVariant: Record<ResponseStatus, BadgeVariant> = {
  [ResponseStatus.pending]: "outline",
  [ResponseStatus.drafted]: "secondary",
  [ResponseStatus.approved]: "default",
  [ResponseStatus.posted]: "default",
  [ResponseStatus.skipped]: "destructive",
};

export function ReviewsContent() {
  const t = useTranslations("reviews");
  const ts = useTranslations("status");

  const { data, isLoading } = trpc.review.list.useQuery({});
  const utils = trpc.useUtils();

  const generateMutation = trpc.response.generate.useMutation({
    onSuccess: () => {
      utils.review.list.invalidate();
      utils.review.stats.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const reviews = data?.reviews ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <AddReviewDialog />
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-semibold">{t("noReviews")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noReviewsDescription")}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("reviewer")}</TableHead>
                <TableHead>{t("rating")}</TableHead>
                <TableHead className="max-w-[300px]">
                  {t("reviewText")}
                </TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(review.reviewedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {review.reviewerName}
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.starRating} />
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {review.reviewText || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[review.responseStatus]}>
                      {ts(review.responseStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {review.responseStatus === ResponseStatus.pending ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          generateMutation.mutate({ reviewId: review.id })
                        }
                        disabled={
                          generateMutation.isPending &&
                          generateMutation.variables?.reviewId === review.id
                        }
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {generateMutation.isPending &&
                        generateMutation.variables?.reviewId === review.id
                          ? t("generating")
                          : t("generateResponse")}
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={ROUTES.responses}>
                          <Eye className="mr-1 h-3 w-3" />
                          {t("viewResponse")}
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
