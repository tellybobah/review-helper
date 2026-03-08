-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('fr', 'en', 'auto');

-- CreateEnum
CREATE TYPE "Tone" AS ENUM ('professional', 'friendly', 'casual');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('trial', 'starter', 'growth');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'past_due', 'cancelled');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('pending', 'drafted', 'approved', 'posted', 'skipped');

-- CreateEnum
CREATE TYPE "CampaignChannel" AS ENUM ('sms', 'email');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'active', 'paused', 'completed');

-- CreateEnum
CREATE TYPE "RecipientStatus" AS ENUM ('pending', 'sent', 'delivered', 'failed', 'clicked', 'reviewed');

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "google_place_id" VARCHAR(255),
    "google_account_id" VARCHAR(255),
    "google_access_token" TEXT,
    "google_refresh_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "language_preference" "Language" NOT NULL DEFAULT 'auto',
    "tone_preference" "Tone" NOT NULL DEFAULT 'friendly',
    "business_type" VARCHAR(100),
    "review_link" TEXT,
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'America/Montreal',
    "stripe_customer_id" VARCHAR(255),
    "subscription_plan" "SubscriptionPlan" NOT NULL DEFAULT 'trial',
    "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "trial_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "google_review_id" VARCHAR(255),
    "reviewer_name" VARCHAR(255) NOT NULL,
    "star_rating" INTEGER NOT NULL,
    "review_text" TEXT,
    "review_language" VARCHAR(10),
    "reviewed_at" TIMESTAMP(3) NOT NULL,
    "response_status" "ResponseStatus" NOT NULL DEFAULT 'pending',
    "ai_response_text" TEXT,
    "final_response_text" TEXT,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "channel" "CampaignChannel" NOT NULL,
    "message_template" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "total_sent" INTEGER NOT NULL DEFAULT 0,
    "total_clicked" INTEGER NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_recipients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "contact_value" VARCHAR(255) NOT NULL,
    "consent_given" BOOLEAN NOT NULL DEFAULT false,
    "status" "RecipientStatus" NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),

    CONSTRAINT "campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_google_review_id_key" ON "reviews"("google_review_id");

-- CreateIndex
CREATE INDEX "reviews_organization_id_response_status_idx" ON "reviews"("organization_id", "response_status");

-- CreateIndex
CREATE INDEX "reviews_organization_id_reviewed_at_idx" ON "reviews"("organization_id", "reviewed_at");

-- CreateIndex
CREATE INDEX "campaigns_organization_id_idx" ON "campaigns"("organization_id");

-- CreateIndex
CREATE INDEX "campaign_recipients_campaign_id_idx" ON "campaign_recipients"("campaign_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

