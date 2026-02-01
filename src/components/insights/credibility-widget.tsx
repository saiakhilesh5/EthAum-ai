'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface CredibilityWidgetProps {
  score: number;
  breakdown: {
    reviewScore: number;
    verificationScore: number;
    engagementScore: number;
    longevityScore: number;
  };
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  badges?: string[];
  recommendations?: string[];
  showEmbed?: boolean;
  startupName?: string;
}

export default function CredibilityWidget({
  score,
  breakdown,
  trend,
  trendValue = 0,
  badges = [],
  recommendations = [],
  showEmbed = false,
  startupName,
}: CredibilityWidgetProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Improvement';
    return 'Low';
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    if (trend === 'down') {
      return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      {/* Score Header */}
      <div className={`bg-gradient-to-r ${getScoreGradient(score)} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10" />
            <div>
              <p className="text-sm opacity-90">Credibility Score</p>
              <div className="flex items-center gap-2">
                <p className="text-4xl font-bold">{score}</p>
                {getTrendIcon()}
                {trendValue !== 0 && (
                  <span className="text-sm">
                    {trendValue > 0 ? '+' : ''}{trendValue} this month
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-white/20 text-white">
              {getScoreLabel(score)}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Score Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Score Breakdown</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Review Score
                </span>
                <span className={getScoreColor(breakdown.reviewScore)}>
                  {breakdown.reviewScore}%
                </span>
              </div>
              <Progress value={breakdown.reviewScore} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Verification
                </span>
                <span className={getScoreColor(breakdown.verificationScore)}>
                  {breakdown.verificationScore}%
                </span>
              </div>
              <Progress value={breakdown.verificationScore} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Engagement
                </span>
                <span className={getScoreColor(breakdown.engagementScore)}>
                  {breakdown.engagementScore}%
                </span>
              </div>
              <Progress value={breakdown.engagementScore} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  Longevity
                </span>
                <span className={getScoreColor(breakdown.longevityScore)}>
                  {breakdown.longevityScore}%
                </span>
              </div>
              <Progress value={breakdown.longevityScore} className="h-2" />
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-3">Earned Badges</h4>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Recommendations
              </h4>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Embed Badge */}
        {showEmbed && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-3">Embed on Your Website</h4>
              <div className="p-4 rounded-lg bg-muted border flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{startupName}</p>
                  <p className="text-xs text-muted-foreground">
                    Credibility Score: {score} | Verified
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <ExternalLink className="w-4 h-4 mr-2" />
                Copy Embed Code
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
