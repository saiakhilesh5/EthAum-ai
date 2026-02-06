'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@src/lib/db/supabase';
import { DEMO_MODE, DEMO_REVIEWS } from '@src/lib/demo-data';
import ReviewCard from './review-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Filter } from 'lucide-react';

interface Review {
  id: string;
  overall_rating: number;
  ease_of_use_rating: number;
  value_for_money_rating: number;
  customer_support_rating: number;
  features_rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string | null;
    job_title?: string;
  };
  enterprise?: {
    company_name: string;
    industry: string;
  };
}

interface ReviewListProps {
  startupId: string;
  limit?: number;
  showFilters?: boolean;
}

export default function ReviewList({
  startupId,
  limit = 10,
  showFilters = true,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews(true);
  }, [startupId, sortBy, filterRating]);

  const fetchReviews = async (reset = false) => {
    if (reset) {
      setPage(1);
      setIsLoading(true);
    }

    const currentPage = reset ? 1 : page;
    const offset = (currentPage - 1) * limit;

    try {
      // Use demo data if DEMO_MODE is enabled
      if (DEMO_MODE) {
        let demoReviews = DEMO_REVIEWS.map(review => ({
          ...review,
          user: {
            full_name: review.reviewer.full_name,
            avatar_url: review.reviewer.avatar_url,
            job_title: review.reviewer.role,
          },
          enterprise: review.reviewer.company ? {
            company_name: review.reviewer.company,
            industry: 'Technology',
          } : null,
        }));

        // Apply rating filter
        if (filterRating !== 'all') {
          demoReviews = demoReviews.filter(r => r.overall_rating === parseInt(filterRating));
        }

        // Apply sorting
        switch (sortBy) {
          case 'newest':
            demoReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'oldest':
            demoReviews.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            break;
          case 'highest':
            demoReviews.sort((a, b) => b.overall_rating - a.overall_rating);
            break;
          case 'lowest':
            demoReviews.sort((a, b) => a.overall_rating - b.overall_rating);
            break;
          case 'helpful':
            demoReviews.sort((a, b) => b.helpful_count - a.helpful_count);
            break;
        }

        const paginatedReviews = demoReviews.slice(offset, offset + limit);
        
        if (reset) {
          setReviews(paginatedReviews as any[]);
        } else {
          setReviews([...reviews, ...paginatedReviews] as any[]);
        }

        setHasMore(paginatedReviews.length === limit);
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('reviews')
        .select(`
          id,
          overall_rating,
          ease_of_use_rating,
          value_for_money_rating,
          customer_support_rating,
          features_rating,
          title,
          content,
          pros,
          cons,
          is_verified,
          helpful_count,
          created_at,
          users (full_name, avatar_url),
          enterprises (company_name, industry)
        `)
        .eq('startup_id', startupId)
        .range(offset, offset + limit - 1);

      // Apply rating filter
      if (filterRating !== 'all') {
        query = query.eq('overall_rating', parseInt(filterRating));
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'highest':
          query = query.order('overall_rating', { ascending: false });
          break;
        case 'lowest':
          query = query.order('overall_rating', { ascending: true });
          break;
        case 'helpful':
          query = query.order('helpful_count', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
        return;
      }

      const formattedReviews = (data || []).map((review: any) => ({
        ...review,
        user: review.users || { full_name: 'Anonymous', avatar_url: null },
        enterprise: review.enterprises || null,
      }));

      if (reset) {
        setReviews(formattedReviews);
      } else {
        setReviews([...reviews, ...formattedReviews]);
      }

      setHasMore(formattedReviews.length === limit);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await supabase.rpc('increment_helpful_count', { review_id: reviewId });
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? { ...review, helpful_count: review.helpful_count + 1 }
            : review
        )
      );
    } catch (error) {
      console.error('Error marking as helpful:', error);
    }
  };

  const handleReport = async (reviewId: string) => {
    // TODO: Implement report functionality
    console.log('Report review:', reviewId);
  };

  const loadMore = () => {
    setPage(page + 1);
    fetchReviews(false);
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[150px]">
              <Star className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No reviews yet</p>
          <p className="text-sm mt-2">Be the first to leave a review!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
                onReport={handleReport}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={loadMore}>
                Load More Reviews
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
