import { ResponseStatus, Language, Tone } from "@prisma/client";

export const LOCALES = ["fr", "en"] as const;
export const DEFAULT_LOCALE = "fr" as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  reviews: "/dashboard/reviews",
  responses: "/dashboard/responses",
  analytics: "/dashboard/analytics",
  settings: "/dashboard/settings",
} as const;

export const AI_CONFIG = {
  model: "claude-sonnet-4-20250514",
  maxTokens: 300,
} as const;

export const TRIAL_DURATION_DAYS = 14;
export const DEFAULT_PAGE_SIZE = 20;
export const QUERY_STALE_TIME_MS = 30_000;

export const RESPONSE_STATUSES = Object.values(ResponseStatus);
export const LANGUAGES = Object.values(Language);
export const TONES = Object.values(Tone);
