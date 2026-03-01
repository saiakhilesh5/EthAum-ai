'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@src/lib/db/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Rocket,
  Building2,
  FileText,
  User,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'startup' | 'launch' | 'user' | 'page';
  title: string;
  subtitle?: string;
  link: string;
  icon?: typeof Rocket;
  badge?: string;
}

const quickLinks: SearchResult[] = [
  { id: 'dashboard', type: 'page', title: 'Dashboard', link: '/dashboard', icon: Building2 },
  { id: 'launches', type: 'page', title: 'My Launches', link: '/launches', icon: Rocket },
  { id: 'new-launch', type: 'page', title: 'Create New Launch', link: '/launches/new', icon: Rocket, badge: 'Action' },
  { id: 'explore', type: 'page', title: 'Explore Startups', link: '/explore', icon: Search },
  { id: 'matchmaking', type: 'page', title: 'AI Matchmaking', link: '/matchmaking', icon: Sparkles },
  { id: 'pitch-analyzer', type: 'page', title: 'Pitch Analyzer', link: '/pitch-analyzer', icon: FileText, badge: 'AI' },
  { id: 'deal-predictor', type: 'page', title: 'Deal Predictor', link: '/deal-predictor', icon: TrendingUp, badge: 'AI' },
  { id: 'settings', type: 'page', title: 'Settings', link: '/settings', icon: User },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Listen for open-search event
  useEffect(() => {
    const handleOpenSearch = () => setIsOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const lowerQuery = searchQuery.toLowerCase();

    try {
      // Filter quick links
      const filteredLinks = quickLinks.filter(
        (link) =>
          link.title.toLowerCase().includes(lowerQuery) ||
          link.subtitle?.toLowerCase().includes(lowerQuery)
      );

      // Search startups
      const { data: startups } = await supabase
        .from('startups')
        .select('id, name, slug, tagline, industry')
        .or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%`)
        .limit(5);

      // Search launches
      const { data: launches } = await supabase
        .from('launches')
        .select('id, title, tagline')
        .or(`title.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%`)
        .limit(5);

      const searchResults: SearchResult[] = [
        ...filteredLinks,
        ...(startups || []).map((s) => ({
          id: s.id,
          type: 'startup' as const,
          title: s.name,
          subtitle: s.tagline,
          link: `/startups/${s.slug || s.id}`,
          icon: Building2,
          badge: s.industry,
        })),
        ...(launches || []).map((l) => ({
          id: l.id,
          type: 'launch' as const,
          title: l.title,
          subtitle: l.tagline,
          link: `/launches/${l.id}`,
          icon: Rocket,
        })),
      ];

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Handle selection
  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setIsOpen(false);
    setQuery('');
    router.push(result.link);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : quickLinks;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (items[selectedIndex]) {
          handleSelect(items[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const displayItems = results.length > 0 ? results : (query ? [] : quickLinks);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search startups, launches, or type a command..."
            className="border-0 focus-visible:ring-0 text-lg py-6"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {query ? 'No results found' : 'Start typing to search...'}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {!query && (
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Quick Links
                </p>
              )}
              {displayItems.map((item, index) => {
                const Icon = item.icon || FileText;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className={`p-2 rounded ${
                      index === selectedIndex ? 'bg-primary-foreground/20' : 'bg-muted'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className={`text-sm truncate ${
                          index === selectedIndex ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    {item.badge && (
                      <Badge variant={index === selectedIndex ? 'secondary' : 'outline'} className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ArrowRight className={`h-4 w-4 ${
                      index === selectedIndex ? '' : 'text-muted-foreground'
                    }`} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="border-t p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Recent Searches
              </p>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(search)}
                    className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">↵</kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border bg-muted">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded border bg-muted">K</kbd>
            to open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
