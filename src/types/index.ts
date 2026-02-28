// Shared types for the application

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  organizationId: string;
  platform: "google" | "yelp" | "facebook";
  rating: number;
  content: string;
  authorName: string;
  createdAt: Date;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  content: string;
  status: "draft" | "approved" | "published";
  generatedByAi: boolean;
  createdAt: Date;
}
