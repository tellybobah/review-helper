import { z } from "zod";
import { ResponseStatus, Language, Tone } from "@prisma/client";
import { router, protectedProcedure } from "@/server/trpc";
import { generateReviewResponse } from "@/server/services/ai-response";

export const responseRouter = router({
  generate: protectedProcedure
    .input(z.object({ reviewId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findFirstOrThrow({
        where: {
          id: input.reviewId,
          organizationId: ctx.organizationId,
        },
      });

      const org = await ctx.db.organization.findUniqueOrThrow({
        where: { id: ctx.organizationId },
      });

      const language =
        review.reviewLanguage === "auto" || !review.reviewLanguage
          ? org.languagePreference === "auto"
            ? Language.fr
            : org.languagePreference
          : (review.reviewLanguage as Language);

      const aiText = await generateReviewResponse({
        reviewerName: review.reviewerName,
        starRating: review.starRating,
        reviewText: review.reviewText ?? "",
        language,
        tone: org.tonePreference,
        businessType: org.businessType ?? "business",
        businessName: org.name,
      });

      return ctx.db.review.update({
        where: { id: review.id },
        data: {
          aiResponseText: aiText,
          finalResponseText: aiText,
          responseStatus: ResponseStatus.drafted,
        },
      });
    }),

  regenerate: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().uuid(),
        tone: z.nativeEnum(Tone),
        language: z.nativeEnum(Language),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findFirstOrThrow({
        where: {
          id: input.reviewId,
          organizationId: ctx.organizationId,
        },
      });

      const org = await ctx.db.organization.findUniqueOrThrow({
        where: { id: ctx.organizationId },
      });

      const language =
        input.language === Language.auto ? Language.fr : input.language;

      const aiText = await generateReviewResponse({
        reviewerName: review.reviewerName,
        starRating: review.starRating,
        reviewText: review.reviewText ?? "",
        language,
        tone: input.tone,
        businessType: org.businessType ?? "business",
        businessName: org.name,
      });

      return ctx.db.review.update({
        where: { id: review.id },
        data: {
          aiResponseText: aiText,
          finalResponseText: aiText,
          responseStatus: ResponseStatus.drafted,
        },
      });
    }),
});
