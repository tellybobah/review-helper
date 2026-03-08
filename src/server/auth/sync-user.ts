import { db } from "@/server/db";
import { UserRole } from "@prisma/client";
import { TRIAL_DURATION_DAYS } from "@/lib/constants";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function getOrCreateUser(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email!;
  const fullName =
    supabaseUser.user_metadata?.full_name ||
    email.split("@")[0];

  const existing = await db.user.findFirst({
    where: { email },
    include: { organization: true },
  });

  if (existing) {
    return existing;
  }

  const slug = email
    .split("@")[0]
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase()
    .concat("-", Date.now().toString(36));

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DURATION_DAYS);

  const newUser = await db.user.create({
    data: {
      email,
      fullName,
      role: UserRole.owner,
      organization: {
        create: {
          name: `${fullName}'s Business`,
          slug,
          trialEndsAt,
        },
      },
    },
    include: { organization: true },
  });

  return newUser;
}
