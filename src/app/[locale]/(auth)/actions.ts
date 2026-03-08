"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocale();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect({ href: "/login?error=invalid", locale });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/dashboard", locale });
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocale();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
    redirect({ href: `/signup?error=signup&message=${encodeURIComponent(error.message)}`, locale });
  }

  revalidatePath("/", "layout");
  redirect({ href: "/dashboard", locale });
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const locale = await getLocale();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/${locale}/dashboard/settings`,
  });

  if (error) {
    redirect({ href: "/forgot-password?error=reset", locale });
  }

  redirect({ href: "/forgot-password?message=check-email", locale });
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const locale = await getLocale();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect({ href: "/login?error=oauth", locale });
  }

  if (data.url) {
    // Use next/navigation redirect for external URLs
    const { redirect: nextRedirect } = await import("next/navigation");
    nextRedirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  const locale = await getLocale();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect({ href: "/login", locale });
}
