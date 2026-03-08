import { PrismaClient, ResponseStatus } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  let org = await db.organization.findFirst();

  if (!org) {
    org = await db.organization.create({
      data: {
        name: "Cafe Demo",
        slug: "cafe-demo",
        businessType: "cafe",
        languagePreference: "fr",
        tonePreference: "friendly",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    await db.user.create({
      data: {
        organizationId: org.id,
        email: "demo@reviewboost.com",
        fullName: "Marie Tremblay",
        role: "owner",
      },
    });
  }

  const existingCount = await db.review.count({
    where: { organizationId: org.id },
  });

  if (existingCount > 0) {
    console.log(`Skipping seed: ${existingCount} reviews already exist.`);
    return;
  }

  const reviews = [
    {
      reviewerName: "Jean-Pierre Gagnon",
      starRating: 5,
      reviewText:
        "Meilleur cafe en ville! Le personnel est super accueillant et les patisseries sont delicieuses.",
      reviewLanguage: "fr",
      responseStatus: ResponseStatus.pending,
      reviewedAt: new Date("2026-02-20"),
    },
    {
      reviewerName: "Sarah Mitchell",
      starRating: 4,
      reviewText:
        "Great coffee and nice atmosphere. The latte art was beautiful. Only wish they had more seating.",
      reviewLanguage: "en",
      responseStatus: ResponseStatus.pending,
      reviewedAt: new Date("2026-02-19"),
    },
    {
      reviewerName: "Marc-Andre Lavoie",
      starRating: 2,
      reviewText:
        "Le service etait lent et mon cappuccino etait tiede. Decevant pour le prix.",
      reviewLanguage: "fr",
      responseStatus: ResponseStatus.pending,
      reviewedAt: new Date("2026-02-18"),
    },
    {
      reviewerName: "Emily Chen",
      starRating: 5,
      reviewText:
        "Absolutely love this place! The croissants are the best I've had outside of Paris.",
      reviewLanguage: "en",
      responseStatus: ResponseStatus.drafted,
      aiResponseText:
        "Emily, thank you so much for your wonderful review! We're thrilled that our croissants remind you of Paris. We put a lot of care into our baking and it means the world to hear that.",
      finalResponseText:
        "Emily, thank you so much for your wonderful review! We're thrilled that our croissants remind you of Paris. We put a lot of care into our baking and it means the world to hear that.",
      reviewedAt: new Date("2026-02-17"),
    },
    {
      reviewerName: "Philippe Bouchard",
      starRating: 3,
      reviewText:
        "Correct sans plus. Le cafe est bon mais l'attente est trop longue aux heures de pointe.",
      reviewLanguage: "fr",
      responseStatus: ResponseStatus.pending,
      reviewedAt: new Date("2026-02-16"),
    },
    {
      reviewerName: "Amanda Brown",
      starRating: 1,
      reviewText:
        "Terrible experience. Wrong order twice and staff was rude about it. Won't be coming back.",
      reviewLanguage: "en",
      responseStatus: ResponseStatus.pending,
      reviewedAt: new Date("2026-02-15"),
    },
    {
      reviewerName: "Isabelle Dupont",
      starRating: 5,
      reviewText: null,
      reviewLanguage: "fr",
      responseStatus: ResponseStatus.approved,
      aiResponseText:
        "Isabelle, merci beaucoup pour votre note de 5 etoiles! Votre satisfaction nous fait enormement plaisir. On a hate de vous revoir bientot!",
      finalResponseText:
        "Isabelle, merci beaucoup pour votre note de 5 etoiles! Votre satisfaction nous fait enormement plaisir. On a hate de vous revoir bientot!",
      respondedAt: new Date("2026-02-14"),
      reviewedAt: new Date("2026-02-13"),
    },
    {
      reviewerName: "David Wilson",
      starRating: 4,
      reviewText:
        "Solid neighborhood cafe. Good espresso, friendly staff. The pastry selection could be wider.",
      reviewLanguage: "en",
      responseStatus: ResponseStatus.drafted,
      aiResponseText:
        "David, thank you for the kind words! We're glad you enjoy our espresso and appreciate our team. We're always looking to expand our pastry selection and your feedback helps!",
      finalResponseText:
        "David, thank you for the kind words! We're glad you enjoy our espresso and appreciate our team. We're always looking to expand our pastry selection and your feedback helps!",
      reviewedAt: new Date("2026-02-12"),
    },
  ];

  for (const review of reviews) {
    await db.review.create({
      data: {
        organizationId: org.id,
        ...review,
      },
    });
  }

  console.log(`Seeded ${reviews.length} reviews for org "${org.name}".`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
