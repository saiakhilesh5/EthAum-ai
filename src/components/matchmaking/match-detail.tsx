'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Globe,
  ExternalLink,
  Calendar,
  Briefcase,
} from 'lucide-react';

interface MatchDetailProps {
  match: {
    id: string;
    match_score: number;
    match_reasons: string[];
    ai_analysis: string;
    status: 'pending' | 'interested' | 'connected' | 'declined';
    created_at: string;
    startup?: {
      id: string;
      name: string;
      slug: string;
      tagline: string;
      description: string;
      logo_url: string | null;
      website_url: string;
      industry: string;
      stage: string;
      arr_range: string;
      team_size: string;
      founding_year: number;
      headquarters: string;
      credibility_score: number;
      total_reviews: number;
      is_verified: boolean;
      tech_stack: string[];
      use_cases: string[];
    };
    enterprise?: {
      id: string;
      company_name: string;
      logo_url: string | null;
      website_url: string;
      industry: string;
      company_size: string;
      headquarters: string;
      description: string;
      is_verified: boolean;
      looking_for: string[];
      budget_range: string;
    };
  };
  userType: 'startup' | 'enterprise';
  onInterest?: () => void;
  onDecline?: () => void;
  onMessage?: () => void;
}

export default function MatchDetail({
  match,
  userType,
  onInterest,
  onDecline,
  onMessage,
}: MatchDetailProps) {
  const isStartupView = userType === 'startup';
  const startup = match.startup;
  const enterprise = match.enterprise;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Match Score Card */}
      <Card className="overflow-hidden">
        <div className={`bg-gradient-to-r ${getScoreColor(match.match_score)} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">AI Match Score</p>
                <p className="text-4xl font-bold">{match.match_score}%</p>
              </div>
            </div>
            <Badge
              className={
                match.status === 'connected'
                  ? 'bg-white/20 text-white'
                  : match.status === 'interested'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/20 text-white'
              }
            >
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </Badge>
          </div>
          <Progress value={match.match_score} className="h-2 mt-4 bg-white/20" />
        </div>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Why This Match</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {match.match_reasons.map((reason, index) => (
              <Badge key={index} variant="secondary">
                {reason}
              </Badge>
            ))}
          </div>
          {match.ai_analysis && (
            <>
              <Separator className="my-4" />
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Analysis
              </h3>
              <p className="text-sm text-muted-foreground">{match.ai_analysis}</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarImage src={isStartupView ? enterprise?.logo_url || '' : startup?.logo_url || ''} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xl">
                {(isStartupView ? enterprise?.company_name : startup?.name)?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">
                  {isStartupView ? enterprise?.company_name : startup?.name}
                </CardTitle>
                {(isStartupView ? enterprise?.is_verified : startup?.is_verified) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <CardDescription className="mt-1">
                {isStartupView ? enterprise?.industry : startup?.tagline}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isStartupView ? (
              <>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{enterprise?.company_size}</p>
                  <p className="text-xs text-muted-foreground">Team Size</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{enterprise?.headquarters}</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{enterprise?.budget_range}</p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Building className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{enterprise?.industry}</p>
                  <p className="text-xs text-muted-foreground">Industry</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{startup?.stage?.replace('_', ' ').toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">Stage</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{startup?.arr_range}</p>
                  <p className="text-xs text-muted-foreground">ARR</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{startup?.credibility_score || '--'}</p>
                  <p className="text-xs text-muted-foreground">Credibility</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Star className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-semibold">{startup?.total_reviews || 0}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <p className="text-muted-foreground">{isStartupView ? enterprise?.description : startup?.description}</p>
          </div>

          {/* Looking For (Enterprise) or Use Cases (Startup) */}
          {isStartupView ? (
            enterprise?.looking_for && enterprise.looking_for.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Looking For</h4>
                <div className="flex flex-wrap gap-2">
                  {enterprise.looking_for.map((item, i) => (
                    <Badge key={i} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          ) : (
            <>
              {startup?.use_cases && startup.use_cases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Use Cases</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.use_cases.map((useCase, i) => (
                      <Badge key={i} variant="secondary">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {startup?.tech_stack && startup.tech_stack.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.tech_stack.map((tech, i) => (
                      <Badge key={i} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Website */}
          {(isStartupView ? enterprise?.website_url : startup?.website_url) && (
            <Button asChild variant="outline" className="w-full">
              <a
                href={isStartupView ? enterprise?.website_url : startup?.website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex gap-3">
            {match.status === 'pending' ? (
              <>
                <Button className="flex-1" onClick={onInterest}>
                  <Star className="w-4 h-4 mr-2" />
                  Show Interest
                </Button>
                <Button variant="outline" onClick={onDecline}>
                  Pass
                </Button>
              </>
            ) : match.status === 'connected' ? (
              <Button className="flex-1" onClick={onMessage}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            ) : (
              <p className="text-center text-muted-foreground w-full">
                {match.status === 'interested'
                  ? 'Waiting for response...'
                  : 'Match declined'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
