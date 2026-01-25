// Database Types for EthAum.ai

export type UserType = 'startup' | 'enterprise' | 'admin';
export type StartupStage = 'series_a' | 'series_b' | 'series_c' | 'series_d';
export type LaunchStatus = 'draft' | 'scheduled' | 'live' | 'ended';
export type ReviewStatus = 'pending' | 'verified' | 'flagged' | 'rejected';
export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface Startup {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  website_url: string | null;
  demo_url: string | null;
  stage: StartupStage;
  arr_range: string;
  industry: string;
  founded_year: number;
  team_size: string;
  headquarters: string;
  technologies: string[];
  features: string[];
  credibility_score: number;
  total_upvotes: number;
  total_reviews: number;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enterprise {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  company_size: string;
  website_url: string | null;
  contact_person: string;
  job_title: string;
  requirements: string;
  budget_range: string;
  preferred_stages: StartupStage[];
  preferred_industries: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Launch {
  id: string;
  startup_id: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail_url: string | null;
  media_urls: string[];
  key_features: string[];
  target_audience: string;
  special_offer: string | null;
  launch_date: string;
  status: LaunchStatus;
  upvote_count: number;
  comment_count: number;
  view_count: number;
  is_featured: boolean;
  featured_badge: string | null;
  ai_generated_content: {
    tagline?: string;
    description?: string;
    highlights?: string[];
  } | null;
  created_at: string;
  updated_at: string;
  // Joined data
  startup?: Startup;
}

export interface Upvote {
  id: string;
  launch_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  launch_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
  replies?: Comment[];
}

export interface Review {
  id: string;
  startup_id: string;
  reviewer_id: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  use_case: string;
  company_size: string;
  job_role: string;
  verified_purchase: boolean;
  status: ReviewStatus;
  ai_authenticity_score: number;
  ai_sentiment: 'positive' | 'neutral' | 'negative';
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  reviewer?: User;
  startup?: Startup;
}

export interface Match {
  id: string;
  startup_id: string;
  enterprise_id: string;
  match_score: number;
  match_reasons: string[];
  status: MatchStatus;
  startup_response: 'pending' | 'interested' | 'not_interested';
  enterprise_response: 'pending' | 'interested' | 'not_interested';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  startup?: Startup;
  enterprise?: Enterprise;
}

export interface CredibilityScore {
  id: string;
  startup_id: string;
  overall_score: number;
  review_score: number;
  engagement_score: number;
  verification_score: number;
  consistency_score: number;
  market_presence_score: number;
  calculated_at: string;
  factors: {
    factor: string;
    score: number;
    weight: number;
  }[];
}

export interface TrendingStartup {
  id: string;
  startup_id: string;
  trend_score: number;
  trend_direction: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly';
  rank: number;
  previous_rank: number | null;
  calculated_at: string;
  startup?: Startup;
}

export interface Badge {
  id: string;
  startup_id: string;
  badge_type: 'featured' | 'top_rated' | 'trending' | 'verified' | 'new';
  badge_label: string;
  awarded_at: string;
  expires_at: string | null;
  metadata: Record<string, any> | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Input Types
export interface StartupFormInput {
  name: string;
  tagline: string;
  description: string;
  website_url?: string;
  demo_url?: string;
  stage: StartupStage;
  arr_range: string;
  industry: string;
  founded_year: number;
  team_size: string;
  headquarters: string;
  technologies: string[];
  features: string[];
}

export interface EnterpriseFormInput {
  company_name: string;
  industry: string;
  company_size: string;
  website_url?: string;
  contact_person: string;
  job_title: string;
  requirements: string;
  budget_range: string;
  preferred_stages: StartupStage[];
  preferred_industries: string[];
}

export interface LaunchFormInput {
  title: string;
  tagline: string;
  description: string;
  key_features: string[];
  target_audience: string;
  special_offer?: string;
  launch_date: string;
}

export interface ReviewFormInput {
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  use_case: string;
  company_size: string;
  job_role: string;
}