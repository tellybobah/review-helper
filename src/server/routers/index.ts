import { router } from "@/server/trpc";
import { organizationRouter } from "./organization";
import { reviewRouter } from "./review";
import { responseRouter } from "./response";

export const appRouter = router({
  organization: organizationRouter,
  review: reviewRouter,
  response: responseRouter,
});

export type AppRouter = typeof appRouter;
