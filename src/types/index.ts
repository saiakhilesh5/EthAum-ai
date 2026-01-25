// Export all types from a single entry point
export * from './database';

// Additional utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  user_type: 'startup' | 'enterprise' | 'admin';
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Filter and Sort types
export interface FilterOptions {
  industry?: string;
  stage?: string;
  rating?: number;
  verified?: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: FilterOptions;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}