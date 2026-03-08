import { z } from "zod";
import { ResponseStatus } from "@prisma/client";
import { router, protectedProcedure } from "@/server/trpc";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export const reviewRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        cursor: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
        status: z.nativeEnum(ResponseStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, status } = input;

      const reviews = await ctx.db.review.findMany({
        where: {
          organizationId: ctx.organizationId,
          ...(status && { responseStatus: status }),
        },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { reviewedAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (reviews.length > limit) {
        const next = reviews.pop();
        nextCursor = next?.id;
      }

      return { reviews, nextCursor };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.review.findFirstOrThrow({
        where: {
          id: input.id,
          organizationId: ctx.organizationId,
        },
      });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const [totalReviews, ratingAgg, pendingCount, draftedCount] =
      await Promise.all([
        ctx.db.review.count({
          where: { organizationId: ctx.organizationId },
        }),
        ctx.db.review.aggregate({
          where: { organizationId: ctx.organizationId },
          _avg: { starRating: true },
        }),
        ctx.db.review.count({
          where: {
            organizationId: ctx.organizationId,
            responseStatus: ResponseStatus.pending,
          },
        }),
        ctx.db.review.count({
          where: {
            organizationId: ctx.organizationId,
            responseStatus: ResponseStatus.drafted,
          },
        }),
      ]);

    return {
      totalReviews,
      averageRating: ratingAgg._avg.starRating ?? 0,
      pendingCount,
      draftedCount,
    };
  }),

  create: protectedProcedure
    .input(
      z.object({
        reviewerName: z.string().min(1).max(255),
        starRating: z.number().int().min(1).max(5),
        reviewText: z.string().optional(),
        reviewLanguage: z.enum(["fr", "en"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.review.create({
        data: {
          organizationId: ctx.organizationId,
          reviewerName: input.reviewerName,
          starRating: input.starRating,
          reviewText: input.reviewText,
          reviewLanguage: input.reviewLanguage,
          reviewedAt: new Date(),
        },
      });
    }),

  analytics: protectedProcedure.query(async ({ ctx }) => {
    const orgId = ctx.organizationId;

    const [
      reviewsPerMonth,
      ratingGroups,
      totalCount,
      respondedCount,
      avgResponseTimeResult,
      thisMonthCount,
    ] = await Promise.all([
      // Reviews per month (last 6 months)
      ctx.db.$queryRaw<{ month: string; count: bigint }[]>`
        SELECT to_char(reviewed_at, 'YYYY-MM') AS month, COUNT(*) AS count
        FROM reviews
        WHERE organization_id = ${orgId}::uuid
          AND reviewed_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `,
      // Rating distribution
      ctx.db.review.groupBy({
        by: ["starRating"],
        where: { organizationId: orgId },
        _count: true,
      }),
      // Total reviews
      ctx.db.review.count({
        where: { organizationId: orgId },
      }),
      // Responded reviews (approved or posted)
      ctx.db.review.count({
        where: {
          organizationId: orgId,
          responseStatus: { in: ["approved", "posted"] },
        },
      }),
      // Average response time in hours
      ctx.db.$queryRaw<{ avg_hours: number | null }[]>`
        SELECT AVG(EXTRACT(EPOCH FROM (responded_at - reviewed_at)) / 3600) AS avg_hours
        FROM reviews
        WHERE organization_id = ${orgId}::uuid
          AND responded_at IS NOT NULL
      `,
      // This month count
      ctx.db.review.count({
        where: {
          organizationId: orgId,
          reviewedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Fill missing stars with 0
    const ratingDistribution = [1, 2, 3, 4, 5].map((star) => {
      const found = ratingGroups.find((g) => g.starRating === star);
      return { star, count: found?._count ?? 0 };
    });

    // Convert bigint to number
    const monthlyTrend = reviewsPerMonth.map((row) => ({
      month: row.month,
      count: Number(row.count),
    }));

    const responseRate = totalCount > 0
      ? Math.round((respondedCount / totalCount) * 100)
      : 0;

    const avgResponseTime = avgResponseTimeResult[0]?.avg_hours
      ? Math.round(avgResponseTimeResult[0].avg_hours * 10) / 10
      : 0;

    return {
      totalReviews: totalCount,
      thisMonthCount,
      responseRate,
      avgResponseTime,
      ratingDistribution,
      monthlyTrend,
    };
  }),

  updateResponse: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        finalResponseText: z.string().min(1),
        responseStatus: z.nativeEnum(ResponseStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.review.update({
        where: {
          id: input.id,
          organizationId: ctx.organizationId,
        },
        data: {
          finalResponseText: input.finalResponseText,
          responseStatus: input.responseStatus,
          ...(input.responseStatus === ResponseStatus.approved && {
            respondedAt: new Date(),
          }),
        },
      });
    }),
});
