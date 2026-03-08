import { createCallerFactory } from "@/server/trpc";
import { createTRPCContext } from "@/server/trpc";
import { appRouter } from "@/server/routers";

const createCaller = createCallerFactory(appRouter);

export async function getServerCaller() {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
}
