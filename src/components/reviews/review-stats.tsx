'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StarRating from './star-rating';
import { Star, Users, TrendingUp } from 'lucide-react';

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryRatings?: {
    easeOfUse: number;
    valueForMoney: number;
    customerSupport: number;
    features: number;
  };
  recommendationRate?: number;
}

export default function ReviewStats({
  averageRating,
  totalReviews,
  ratingDistribution,
  categoryRatings,
  recommendationRate,
}: ReviewStatsProps) {
  const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  const getPercentage = (count: number) => {
    if (totalRatings === 0) return 0;
    return Math.round((count / totalRatings) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Review Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold">{averageRating.toFixed(1)}</p>
            <StarRating rating={averageRating} size="sm" className="justify-center mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-6">{rating}</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Progress
                  value={getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}
                  className="flex-1 h-2"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Ratings */}
        {categoryRatings && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-4">Category Ratings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Ease of Use</span>
                  <span className="text-sm font-medium">{categoryRatings.easeOfUse.toFixed(1)}</span>
                </div>
                <Progress value={categoryRatings.easeOfUse * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Value for Money</span>
                  <span className="text-sm font-medium">{categoryRatings.valueForMoney.toFixed(1)}</span>
                </div>
                <Progress value={categoryRatings.valueForMoney * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Customer Support</span>
                  <span className="text-sm font-medium">{categoryRatings.customerSupport.toFixed(1)}</span>
                </div>
                <Progress value={categoryRatings.customerSupport * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Features</span>
                  <span className="text-sm font-medium">{categoryRatings.features.toFixed(1)}</span>
                </div>
                <Progress value={categoryRatings.features * 20} className="h-2" />
              </div>
            </div>
          </div>
        )}

        {/* Recommendation Rate */}
        {recommendationRate !== undefined && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Would Recommend</span>
              </div>
              <span className="text-2xl font-bold text-green-500">
                {recommendationRate}%
              </span>
            </div>
            <Progress value={recommendationRate} className="h-2 mt-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
