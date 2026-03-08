"use client";

import { useTranslations } from "next-intl";
import { ResponseStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseCard } from "./response-card";
import { trpc } from "@/lib/trpc/client";

export function ResponsesContent() {
  const t = useTranslations("responses");

  const { data: draftedData, isLoading: draftedLoading } =
    trpc.review.list.useQuery({ status: ResponseStatus.drafted });
  const { data: approvedData, isLoading: approvedLoading } =
    trpc.review.list.useQuery({ status: ResponseStatus.approved });

  const isLoading = draftedLoading || approvedLoading;

  const draftedReviews = draftedData?.reviews ?? [];
  const approvedReviews = approvedData?.reviews ?? [];
  const allResponses = [...draftedReviews, ...approvedReviews].sort(
    (a, b) =>
      new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {allResponses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-semibold">{t("noResponses")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("noResponsesDescription")}
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              {t("tabAll")} ({allResponses.length})
            </TabsTrigger>
            <TabsTrigger value="drafted">
              {t("tabDrafted")} ({draftedReviews.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              {t("tabApproved")} ({approvedReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allResponses.map((review) => (
              <ResponseCard key={review.id} review={review} />
            ))}
          </TabsContent>

          <TabsContent value="drafted" className="space-y-4">
            {draftedReviews.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                {t("noResponses")}
              </p>
            ) : (
              draftedReviews.map((review) => (
                <ResponseCard key={review.id} review={review} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedReviews.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                {t("noResponses")}
              </p>
            ) : (
              approvedReviews.map((review) => (
                <ResponseCard key={review.id} review={review} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
