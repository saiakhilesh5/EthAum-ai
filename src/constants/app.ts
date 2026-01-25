export const APP_NAME = 'EthAum.ai';
export const APP_DESCRIPTION =
  'AI-powered SaaS marketplace combining Product Hunt, G2, Gartner & AppSumo for Series A to D startups';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const STARTUP_STAGES = [
  { value: 'series_a', label: 'Series A', arrRange: '$1M - $5M' },
  { value: 'series_b', label: 'Series B', arrRange: '$5M - $15M' },
  { value: 'series_c', label: 'Series C', arrRange: '$15M - $30M' },
  { value: 'series_d', label: 'Series D', arrRange: '$30M - $50M+' },
] as const;

export const ARR_RANGES = [
  '$1M - $2M',
  '$2M - $5M',
  '$5M - $10M',
  '$10M - $20M',
  '$20M - $30M',
  '$30M - $50M',
  '$50M+',
] as const;

export const INDUSTRIES = [
  'Artificial Intelligence',
  'Machine Learning',
  'SaaS',
  'FinTech',
  'HealthTech',
  'EdTech',
  'E-commerce',
  'Cybersecurity',
  'Cloud Computing',
  'Data Analytics',
  'DevOps',
  'HR Tech',
  'MarTech',
  'PropTech',
  'LegalTech',
  'InsurTech',
  'AgriTech',
  'CleanTech',
  'Logistics',
  'Other',
] as const;

export const TEAM_SIZES = [
  '1-10',
  '11-50',
  '51-100',
  '101-250',
  '251-500',
  '500+',
] as const;

export const COMPANY_SIZES = [
  'Startup (1-50)',
  'Small Business (51-200)',
  'Mid-Market (201-1000)',
  'Enterprise (1000+)',
] as const;

export const BUDGET_RANGES = [
  'Under $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000+',
] as const;

export const BADGE_TYPES = {
  featured: { label: 'Featured', color: 'bg-yellow-500' },
  top_rated: { label: 'Top Rated', color: 'bg-green-500' },
  trending: { label: 'Trending', color: 'bg-purple-500' },
  verified: { label: 'Verified', color: 'bg-blue-500' },
  new: { label: 'New', color: 'bg-pink-500' },
} as const;

export const REVIEW_RATINGS = [
  { value: 5, label: 'Excellent' },
  { value: 4, label: 'Good' },
  { value: 3, label: 'Average' },
  { value: 2, label: 'Below Average' },
  { value: 1, label: 'Poor' },
] as const;