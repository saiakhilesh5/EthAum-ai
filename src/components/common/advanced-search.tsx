'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { supabase } from '@src/lib/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Building2,
  ArrowUpRight,
  Star,
} from 'lucide-react';

interface FilterState {
  query: string;
  industries: string[];
  stages: string[];
  minTrustScore: number;
  minRating: number;
  sortBy: 'relevance' | 'trust_score' | 'rating' | 'newest' | 'name';
  verified: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  industry: string;
  stage: string;
  trust_score: number;
  logo_url?: string;
  avg_rating?: number;
  review_count?: number;
}

const INDUSTRIES = [
  'AI/ML',
  'Fintech',
  'HealthTech',
  'EdTech',
  'SaaS',
  'E-commerce',
  'Cybersecurity',
  'DevTools',
  'MarTech',
  'CleanTech',
  'Other',
];

const STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Bootstrapped',
];

export function AdvancedSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get('q') || '',
    industries: searchParams.get('industries')?.split(',').filter(Boolean) || [],
    stages: searchParams.get('stages')?.split(',').filter(Boolean) || [],
    minTrustScore: parseInt(searchParams.get('minScore') || '0'),
    minRating: parseFloat(searchParams.get('minRating') || '0'),
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'relevance',
    verified: searchParams.get('verified') === 'true',
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Sync filters to URL
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.industries.length) params.set('industries', newFilters.industries.join(','));
    if (newFilters.stages.length) params.set('stages', newFilters.stages.join(','));
    if (newFilters.minTrustScore > 0) params.set('minScore', newFilters.minTrustScore.toString());
    if (newFilters.minRating > 0) params.set('minRating', newFilters.minRating.toString());
    if (newFilters.sortBy !== 'relevance') params.set('sort', newFilters.sortBy);
    if (newFilters.verified) params.set('verified', 'true');

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [pathname, router]);

  // Perform search
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('startups')
        .select('id, name, slug, tagline, industry, stage, trust_score, logo_url', { count: 'exact' });

      // Text search
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,tagline.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      // Industry filter
      if (filters.industries.length > 0) {
        query = query.in('industry', filters.industries);
      }

      // Stage filter
      if (filters.stages.length > 0) {
        query = query.in('stage', filters.stages);
      }

      // Trust score filter
      if (filters.minTrustScore > 0) {
        query = query.gte('trust_score', filters.minTrustScore);
      }

      // Verified filter
      if (filters.verified) {
        query = query.eq('verified', true);
      }

      // Sorting
      switch (filters.sortBy) {
        case 'trust_score':
          query = query.order('trust_score', { ascending: false, nullsFirst: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        default:
          // Relevance - prioritize trust score and completeness
          query = query.order('trust_score', { ascending: false, nullsFirst: false });
      }

      const { data, count, error } = await query.limit(50);

      if (error) throw error;

      // Get ratings for results
      if (data && data.length > 0) {
        const { data: ratings } = await supabase
          .from('reviews')
          .select('startup_id, overall_rating')
          .in('startup_id', data.map(s => s.id));

        const ratingMap = new Map<string, { sum: number; count: number }>();
        ratings?.forEach(r => {
          const existing = ratingMap.get(r.startup_id) || { sum: 0, count: 0 };
          existing.sum += r.overall_rating;
          existing.count += 1;
          ratingMap.set(r.startup_id, existing);
        });

        const resultsWithRatings = data.map(startup => ({
          ...startup,
          avg_rating: ratingMap.has(startup.id) 
            ? ratingMap.get(startup.id)!.sum / ratingMap.get(startup.id)!.count 
            : undefined,
          review_count: ratingMap.get(startup.id)?.count || 0,
        }));

        // Filter by rating if needed
        const filtered = filters.minRating > 0
          ? resultsWithRatings.filter(s => (s.avg_rating || 0) >= filters.minRating)
          : resultsWithRatings;

        setResults(filtered);
      } else {
        setResults([]);
      }

      setTotalCount(count || 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const toggleArrayFilter = (key: 'industries' | 'stages', value: string) => {
    const current = filters[key];
    const newValue = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, newValue);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      query: '',
      industries: [],
      stages: [],
      minTrustScore: 0,
      minRating: 0,
      sortBy: 'relevance',
      verified: false,
    };
    setFilters(cleared);
    router.push(pathname);
  };

  const activeFilterCount = 
    filters.industries.length + 
    filters.stages.length + 
    (filters.minTrustScore > 0 ? 1 : 0) + 
    (filters.minRating > 0 ? 1 : 0) +
    (filters.verified ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            placeholder="Search startups, industries, or technologies..."
            className="pl-10 pr-4"
          />
        </div>
        
        {/* Desktop Filter Toggle */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[340px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Industries */}
              <div>
                <h4 className="font-medium mb-3">Industry</h4>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((industry) => (
                    <Badge
                      key={industry}
                      variant={filters.industries.includes(industry) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('industries', industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stages */}
              <div>
                <h4 className="font-medium mb-3">Stage</h4>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((stage) => (
                    <Badge
                      key={stage}
                      variant={filters.stages.includes(stage) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('stages', stage)}
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Trust Score */}
              <div>
                <h4 className="font-medium mb-3">
                  Minimum Trust Score: {filters.minTrustScore}
                </h4>
                <Slider
                  value={[filters.minTrustScore]}
                  onValueChange={([value]) => updateFilter('minTrustScore', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium mb-3">
                  Minimum Rating: {filters.minRating.toFixed(1)}
                </h4>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={([value]) => updateFilter('minRating', value)}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Verified Only */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={filters.verified}
                  onCheckedChange={(checked) => updateFilter('verified', !!checked)}
                />
                <label htmlFor="verified" className="text-sm cursor-pointer">
                  Verified startups only
                </label>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button variant="ghost" className="w-full" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value as FilterState['sortBy'])}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="trust_score">Trust Score</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.industries.map((industry) => (
            <Badge key={industry} variant="secondary" className="gap-1">
              {industry}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('industries', industry)}
              />
            </Badge>
          ))}
          {filters.stages.map((stage) => (
            <Badge key={stage} variant="secondary" className="gap-1">
              {stage}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleArrayFilter('stages', stage)}
              />
            </Badge>
          ))}
          {filters.minTrustScore > 0 && (
            <Badge variant="secondary" className="gap-1">
              Score ≥ {filters.minTrustScore}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('minTrustScore', 0)}
              />
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              Rating ≥ {filters.minRating}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('minRating', 0)}
              />
            </Badge>
          )}
          {filters.verified && (
            <Badge variant="secondary" className="gap-1">
              Verified
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('verified', false)}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {isLoading ? 'Searching...' : `${totalCount} startups found`}
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-2">No startups found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          results.map((startup) => (
            <a
              key={startup.id}
              href={`/startups/${startup.slug || startup.id}`}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                {startup.logo_url ? (
                  <img
                    src={startup.logo_url}
                    alt={startup.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {startup.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {startup.tagline}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {startup.industry}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {startup.stage}
                  </Badge>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 justify-end">
                  <span className={`font-bold ${
                    startup.trust_score >= 80 ? 'text-green-500' :
                    startup.trust_score >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {startup.trust_score?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-xs text-muted-foreground">trust</span>
                </div>
                {startup.avg_rating && (
                  <div className="flex items-center gap-1 justify-end text-sm">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span>{startup.avg_rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({startup.review_count})
                    </span>
                  </div>
                )}
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
