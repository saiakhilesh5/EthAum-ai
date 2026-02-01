'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@src/lib/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INDUSTRIES, STARTUP_STAGES } from '@src/constants/app';
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Award,
  Rocket,
  Users,
  BarChart3,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Startup {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo_url: string | null;
  industry: string;
  stage: string;
  arr_range: string;
  credibility_score: number;
  total_upvotes: number;
  total_reviews: number;
  is_verified: boolean;
  is_featured: boolean;
}

export default function ExplorePage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [featuredStartups, setFeaturedStartups] = useState<Startup[]>([]);
  const [trendingStartups, setTrendingStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('credibility');

  useEffect(() => {
    fetchStartups();
    fetchFeaturedStartups();
    fetchTrendingStartups();
  }, [industryFilter, stageFilter, sortBy]);

  const fetchStartups = async () => {
    try {
      let query = supabase
        .from('startups')
        .select('*');

      if (industryFilter !== 'all') {
        query = query.eq('industry', industryFilter);
      }

      if (stageFilter !== 'all') {
        query = query.eq('stage', stageFilter);
      }

      switch (sortBy) {
        case 'credibility':
          query = query.order('credibility_score', { ascending: false });
          break;
        case 'reviews':
          query = query.order('total_reviews', { ascending: false });
          break;
        case 'upvotes':
          query = query.order('total_upvotes', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedStartups = async () => {
    const { data } = await supabase
      .from('startups')
      .select('*')
      .eq('is_featured', true)
      .limit(5);

    setFeaturedStartups(data || []);
  };

  const fetchTrendingStartups = async () => {
    const { data } = await supabase
      .from('startups')
      .select('*')
      .order('total_upvotes', { ascending: false })
      .limit(5);

    setTrendingStartups(data || []);
  };

  const filteredStartups = startups.filter((startup) =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatStage = (stage: string) => {
    return stage.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'series_a':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'series_b':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'series_c':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'series_d':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StartupCard = ({ startup }: { startup: Startup }) => (
    <Link href={`/startups/${startup.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarImage src={startup.logo_url || ''} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                {startup.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                  {startup.name}
                </h3>
                {startup.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {startup.is_featured && (
                  <Badge className="bg-yellow-500 text-white text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {startup.tagline}
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge variant="outline" className={getStageColor(startup.stage)}>
                  {formatStage(startup.stage)}
                </Badge>
                <span className="text-xs text-muted-foreground">{startup.industry}</span>
                <span className="text-xs text-muted-foreground">{startup.arr_range}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                {startup.credibility_score > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <BarChart3 className="w-4 h-4" />
                    {startup.credibility_score}
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-4 h-4" />
                  {startup.total_reviews} reviews
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  {startup.total_upvotes} upvotes
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-10 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Discover Series A-D Startups
          </h1>
          <p className="text-base md:text-xl text-primary-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto">
            AI-powered marketplace for validated startups with $1M-$50M+ ARR
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input
              placeholder="Search startups..."
              className="pl-10 md:pl-12 pr-4 py-5 md:py-6 text-base md:text-lg bg-background text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Featured Section */}
        {featuredStartups.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
              Featured Startups
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {featuredStartups.slice(0, 3).map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {trendingStartups.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
              Trending This Week
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {trendingStartups.slice(0, 3).map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[180px]">
                <Rocket className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STARTUP_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <BarChart3 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credibility">Credibility Score</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="upvotes">Most Upvotes</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* All Startups */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6" />
            All Startups
            <Badge variant="secondary">{filteredStartups.length}</Badge>
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : filteredStartups.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No startups found matching your criteria</p>
              <p className="text-sm mt-2">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStartups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
