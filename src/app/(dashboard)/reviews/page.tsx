'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { ReviewList, ReviewStats, ReviewForm } from '@src/components/reviews';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Star,
  Plus,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

interface Startup {
  id: string;
  name: string;
  logo_url: string | null;
  total_reviews: number;
  credibility_score: number;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryRatings: {
    easeOfUse: number;
    valueForMoney: number;
    customerSupport: number;
    features: number;
  };
  recommendationRate: number;
}

export default function ReviewsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    if (user) {
      fetchStartupData();
    }
  }, [user]);

  const fetchStartupData = async () => {
    if (!user) return;

    try {
      // Fetch startup
      const { data: startupData, error: startupError } = await supabase
        .from('startups')
        .select('id, name, logo_url, total_reviews, credibility_score')
        .eq('user_id', user.id)
        .single();

      if (startupError) {
        if (startupError.code !== 'PGRST116') {
          console.error('Error fetching startup:', startupError);
        }
        setIsLoading(false);
        return;
      }

      setStartup(startupData);

      // Fetch review statistics
      const { data: reviews } = await supabase
        .from('reviews')
        .select('overall_rating, ease_of_use_rating, value_for_money_rating, customer_support_rating, features_rating, recommend_likelihood')
        .eq('startup_id', startupData.id);

      if (reviews && reviews.length > 0) {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalOverall = 0;
        let totalEase = 0;
        let totalValue = 0;
        let totalSupport = 0;
        let totalFeatures = 0;
        let totalRecommend = 0;

        reviews.forEach((review) => {
          distribution[review.overall_rating as keyof typeof distribution]++;
          totalOverall += review.overall_rating;
          totalEase += review.ease_of_use_rating || 0;
          totalValue += review.value_for_money_rating || 0;
          totalSupport += review.customer_support_rating || 0;
          totalFeatures += review.features_rating || 0;
          totalRecommend += review.recommend_likelihood || 5;
        });

        const count = reviews.length;
        setReviewSummary({
          averageRating: totalOverall / count,
          totalReviews: count,
          ratingDistribution: distribution,
          categoryRatings: {
            easeOfUse: totalEase / count,
            valueForMoney: totalValue / count,
            customerSupport: totalSupport / count,
            features: totalFeatures / count,
          },
          recommendationRate: Math.round((totalRecommend / count) * 10),
        });
      }

      // Count pending reviews (unverified)
      const { count: pending } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('startup_id', startupData.id)
        .eq('is_verified', false);

      setPendingReviews(pending || 0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 md:h-96" />
          </div>
          <Skeleton className="h-48 md:h-64" />
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg md:text-xl font-semibold mb-2">No Startup Profile</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Create your startup profile first to start collecting reviews.
            </p>
            <Button asChild>
              <a href="/profile/startup">Create Profile</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <Avatar className="h-10 w-10 md:h-12 md:w-12">
            <AvatarImage src={startup.logo_url || ''} />
            <AvatarFallback>{startup.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Reviews</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Manage reviews for {startup.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1 text-xs">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
            {reviewSummary?.averageRating.toFixed(1) || '--'}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
            {startup.total_reviews}
          </Badge>
          {pendingReviews > 0 && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              {pendingReviews} pending
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <Star className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-yellow-500" />
            <p className="text-xl md:text-2xl font-bold">
              {reviewSummary?.averageRating.toFixed(1) || '--'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-primary" />
            <p className="text-xl md:text-2xl font-bold">{reviewSummary?.totalReviews || 0}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-green-500" />
            <p className="text-xl md:text-2xl font-bold">{reviewSummary?.recommendationRate || 0}%</p>
            <p className="text-xs md:text-sm text-muted-foreground">Recommend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-blue-500" />
            <p className="text-xl md:text-2xl font-bold">{startup.credibility_score || '--'}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="verified">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  {pendingReviews > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5">
                      {pendingReviews}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <ReviewList startupId={startup.id} />
            </TabsContent>

            <TabsContent value="verified">
              <ReviewList startupId={startup.id} />
            </TabsContent>

            <TabsContent value="pending">
              <ReviewList startupId={startup.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review Stats */}
          {reviewSummary && (
            <ReviewStats
              averageRating={reviewSummary.averageRating}
              totalReviews={reviewSummary.totalReviews}
              ratingDistribution={reviewSummary.ratingDistribution}
              categoryRatings={reviewSummary.categoryRatings}
              recommendationRate={reviewSummary.recommendationRate}
            />
          )}

          {/* Request Reviews Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Get More Reviews</CardTitle>
              <CardDescription>
                Share this link with your customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/startups/{startup.id}/review
                </code>
              </div>
              <Button className="w-full" variant="outline">
                Copy Review Link
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Reviews help improve your credibility score
              </div>
            </CardContent>
          </Card>

          {/* Embed Badge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Embed Review Badge</CardTitle>
              <CardDescription>
                Showcase reviews on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted border flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={startup.logo_url || ''} />
                  <AvatarFallback className="text-xs">
                    {startup.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{startup.name}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{reviewSummary?.averageRating.toFixed(1) || '--'}</span>
                    <span className="text-xs text-muted-foreground">
                      ({reviewSummary?.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Copy Embed Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
