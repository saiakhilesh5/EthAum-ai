'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Sparkles,
  X,
  ArrowRight,
  TrendingUp,
  Star,
  Building2,
  Zap,
  Filter,
  Clock,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from '@src/hooks/use-debounce';

interface SearchResult {
  id: string;
  type: 'startup' | 'launch' | 'review' | 'category';
  title: string;
  description: string;
  category?: string;
  score?: number;
  relevance: number;
  link: string;
}

interface SmartSearchProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
}

const suggestedSearches = [
  { query: 'AI tools for enterprise', icon: Sparkles },
  { query: 'Best rated security startups', icon: Star },
  { query: 'Recently funded data analytics', icon: TrendingUp },
  { query: 'Remote collaboration tools', icon: Building2 },
];

const demoResults: SearchResult[] = [
  {
    id: '1',
    type: 'startup',
    title: 'CloudSync Pro',
    description: 'Enterprise cloud data synchronization platform',
    category: 'Cloud Infrastructure',
    score: 92,
    relevance: 98,
    link: '/startups/1',
  },
  {
    id: '2',
    type: 'startup',
    title: 'DataFlow AI',
    description: 'AI-powered data pipeline automation',
    category: 'Data Analytics',
    score: 88,
    relevance: 85,
    link: '/startups/2',
  },
  {
    id: '3',
    type: 'launch',
    title: 'SecureVault 2.0 Launch',
    description: 'Major security update with AI threat detection',
    category: 'Product Launch',
    relevance: 78,
    link: '/launches/1',
  },
  {
    id: '4',
    type: 'category',
    title: 'AI & Machine Learning',
    description: '47 startups in this category',
    relevance: 72,
    link: '/explore?category=ai',
  },
];

export default function SmartSearch({ placeholder, onResultSelect }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setAiInterpretation('');
      return;
    }

    const search = async () => {
      setIsSearching(true);
      
      try {
        const response = await fetch('/api/ai/smart-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: debouncedQuery }),
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        setResults(data.results);
        setAiInterpretation(data.interpretation);
      } catch (error) {
        // Demo results
        const filtered = demoResults.filter(
          (r) =>
            r.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            r.category?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setResults(filtered.length > 0 ? filtered : demoResults.slice(0, 3));
        setAiInterpretation(
          `Searching for "${debouncedQuery}" across startups, launches, and categories...`
        );
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updated = [result.title, ...recentSearches.filter((s) => s !== result.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setIsOpen(false);
    setQuery('');
    onResultSelect?.(result);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'startup':
        return <Building2 className="w-4 h-4" />;
      case 'launch':
        return <Zap className="w-4 h-4" />;
      case 'category':
        return <Filter className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || 'Search startups, launches, categories...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20 h-12 text-base"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI
          </Badge>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4">
            {/* AI Interpretation */}
            {aiInterpretation && (
              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg mb-4">
                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">{aiInterpretation}</p>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!isSearching && results.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Results ({results.length})
                </p>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.link}
                    onClick={() => handleSelect(result)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{result.title}</p>
                        {result.score && (
                          <Badge variant="secondary" className="text-xs">
                            {result.score}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {result.type}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Query State */}
            {!query && !isSearching && (
              <div className="space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Recent Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Searches */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Suggested Searches
                  </p>
                  <div className="space-y-1">
                    {suggestedSearches.map((suggestion, i) => {
                      const Icon = suggestion.icon;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion.query)}
                          className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted text-left transition-colors"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{suggestion.query}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {query && !isSearching && results.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No results found</p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or browse categories
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
