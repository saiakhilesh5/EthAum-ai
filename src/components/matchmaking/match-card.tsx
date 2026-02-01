'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  Star,
  TrendingUp,
  CheckCircle,
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  MessageSquare,
  Eye,
} from 'lucide-react';

interface Match {
  id: string;
  match_score: number;
  match_reasons: string[];
  status: 'pending' | 'interested' | 'connected' | 'declined';
  created_at: string;
  startup?: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logo_url: string | null;
    industry: string;
    stage: string;
    arr_range: string;
    credibility_score: number;
    is_verified: boolean;
  };
  enterprise?: {
    id: string;
    company_name: string;
    logo_url: string | null;
    industry: string;
    company_size: string;
    headquarters: string;
    is_verified: boolean;
  };
}

interface MatchCardProps {
  match: Match;
  userType: 'startup' | 'enterprise';
  onInterest?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
  onView?: (matchId: string) => void;
  onMessage?: (matchId: string) => void;
}

export default function MatchCard({
  match,
  userType,
  onInterest,
  onDecline,
  onView,
  onMessage,
}: MatchCardProps) {
  const isStartupView = userType === 'startup';
  const startup = match.startup;
  const enterprise = match.enterprise;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Potential Match';
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case 'connected':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'interested':
        return (
          <Badge className="bg-blue-500 text-white">
            <Star className="w-3 h-3 mr-1" />
            Interested
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="secondary" className="text-muted-foreground">
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Match Score Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium">AI Match</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getScoreColor(match.match_score)}`}>
              {match.match_score}%
            </span>
            {getStatusBadge()}
          </div>
        </div>
        <Progress value={match.match_score} className="h-2 mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          {getScoreLabel(match.match_score)}
        </p>
      </div>

      <CardContent className="p-5">
        {/* Profile Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-xl">
            <AvatarImage src={isStartupView ? enterprise?.logo_url || '' : startup?.logo_url || ''} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
              {(isStartupView ? enterprise?.company_name : startup?.name)?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">
                {isStartupView ? enterprise?.company_name : startup?.name}
              </h3>
              {(isStartupView ? enterprise?.is_verified : startup?.is_verified) && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {isStartupView ? enterprise?.industry : startup?.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              {isStartupView ? (
                <>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {enterprise?.company_size}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {enterprise?.headquarters}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {startup?.stage?.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {startup?.arr_range}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Score: {startup?.credibility_score || '--'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Match Reasons */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Why this match:</p>
          <div className="flex flex-wrap gap-2">
            {match.match_reasons.slice(0, 3).map((reason, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {reason}
              </Badge>
            ))}
            {match.match_reasons.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{match.match_reasons.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {match.status === 'pending' ? (
            <>
              <Button
                className="flex-1"
                onClick={() => onInterest?.(match.id)}
              >
                <Star className="w-4 h-4 mr-2" />
                Show Interest
              </Button>
              <Button
                variant="outline"
                onClick={() => onDecline?.(match.id)}
              >
                Pass
              </Button>
            </>
          ) : match.status === 'connected' ? (
            <>
              <Button className="flex-1" onClick={() => onMessage?.(match.id)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" onClick={() => onView?.(match.id)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onView?.(match.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
