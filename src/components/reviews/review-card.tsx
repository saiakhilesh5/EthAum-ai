'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './star-rating';
import {
  ThumbsUp,
  Flag,
  CheckCircle,
  Building,
  MessageSquare,
} from 'lucide-react';

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

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showRatings?: boolean;
}

export default function ReviewCard({
  review,
  onHelpful,
  onReport,
  showRatings = true,
}: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.user?.avatar_url || ''} />
              <AvatarFallback>
                {review.user?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{review.user?.full_name || 'Anonymous'}</p>
                {review.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Verified
                  </Badge>
                )}
              </div>
              {review.user?.job_title && (
                <p className="text-sm text-muted-foreground">{review.user.job_title}</p>
              )}
              {review.enterprise && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {review.enterprise.company_name}
                  <span className="text-xs">• {review.enterprise.industry}</span>
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={review.overall_rating} size="sm" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>

        {/* Content */}
        <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
          {review.content}
        </p>

        {/* Detailed Ratings */}
        {showRatings && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Ease of Use</p>
              <StarRating rating={review.ease_of_use_rating} size="sm" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Value</p>
              <StarRating rating={review.value_for_money_rating} size="sm" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Support</p>
              <StarRating rating={review.customer_support_rating} size="sm" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Features</p>
              <StarRating rating={review.features_rating} size="sm" />
            </div>
          </div>
        )}

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {review.pros && review.pros.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-green-600 mb-2">Pros</p>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-red-600 mb-2">Cons</p>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful?.(review.id)}
              className="text-muted-foreground"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful ({review.helpful_count || 0})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Reply
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReport?.(review.id)}
            className="text-muted-foreground"
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
