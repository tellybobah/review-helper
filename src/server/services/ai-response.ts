import Anthropic from "@anthropic-ai/sdk";
import { Language, Tone } from "@prisma/client";
import { AI_CONFIG } from "@/lib/constants";

const anthropic = new Anthropic();

const languageInstructions: Record<Language, string> = {
  [Language.fr]:
    "Respond entirely in Quebec French (Canadian French). Use natural Quebec expressions.",
  [Language.en]:
    "Respond entirely in English.",
  [Language.auto]:
    "Respond in Quebec French (Canadian French).",
};

const toneInstructions: Record<Tone, string> = {
  [Tone.professional]:
    "Use a professional and polished tone. Be courteous and formal.",
  [Tone.friendly]:
    "Use a warm and friendly tone. Be approachable and personable.",
  [Tone.casual]:
    "Use a casual and relaxed tone. Be conversational and natural.",
};

const ratingContext: Record<number, string> = {
  1: "This is a 1-star review. The customer is very dissatisfied. Apologize sincerely, acknowledge their frustration, and express a genuine desire to make things right.",
  2: "This is a 2-star review. The customer had a poor experience. Apologize for the shortcomings and show willingness to improve.",
  3: "This is a 3-star review. The customer had a mixed experience. Thank them for the feedback, acknowledge what could be better, and highlight your commitment to improvement.",
  4: "This is a 4-star review. The customer had a good experience with minor issues. Thank them warmly and acknowledge their feedback.",
  5: "This is a 5-star review. The customer is very satisfied. Express genuine gratitude and enthusiasm.",
};

interface GenerateParams {
  reviewerName: string;
  starRating: number;
  reviewText: string;
  language: Language;
  tone: Tone;
  businessType: string;
  businessName: string;
}

export async function generateReviewResponse(
  params: GenerateParams
): Promise<string> {
  const {
    reviewerName,
    starRating,
    reviewText,
    language,
    tone,
    businessType,
    businessName,
  } = params;

  const firstName = reviewerName.split(" ")[0];

  const systemPrompt = `You are a review response assistant for "${businessName}", a ${businessType}.

${languageInstructions[language]}
${toneInstructions[tone]}
${ratingContext[starRating] ?? ratingContext[3]}

Rules:
- Write 2-4 sentences only.
- Address the reviewer by their first name: "${firstName}".
- Do NOT use generic filler phrases.
- Do NOT invent details that are not in the review.
- Do NOT include a greeting line like "Dear..." or a sign-off like "Sincerely...".
- Only output the response text, nothing else.`;

  const userPrompt = reviewText
    ? `Review from ${reviewerName} (${starRating}/5 stars):\n"${reviewText}"`
    : `Review from ${reviewerName}: ${starRating}/5 stars (no text provided).`;

  const message = await anthropic.messages.create({
    model: AI_CONFIG.model,
    max_tokens: AI_CONFIG.maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = message.content[0];
  if (block.type === "text") {
    return block.text.trim();
  }

  throw new Error("Unexpected AI response format");
}
