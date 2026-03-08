import { z } from "zod";
import { Language, Tone } from "@prisma/client";
import { router, protectedProcedure } from "@/server/trpc";

export const organizationRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.organization.findUniqueOrThrow({
      where: { id: ctx.organizationId },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        businessType: z.string().max(100).optional(),
        reviewLink: z.string().url().optional(),
        languagePreference: z.nativeEnum(Language).optional(),
        tonePreference: z.nativeEnum(Tone).optional(),
        timezone: z.string().max(50).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.organization.update({
        where: { id: ctx.organizationId },
        data: input,
      });
    }),
});
