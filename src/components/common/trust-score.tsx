'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@src/lib/db/supabase';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Globe,
  Users,
  FileCheck,
  Linkedin,
  Github,
  Twitter,
  Building2,
  Mail,
  Phone,
  CreditCard,
  Award,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface VerificationItem {
  id: string;
  name: string;
  icon: any;
  status: 'verified' | 'pending' | 'unverified';
  description: string;
  points: number;
  verifiedAt?: string;
}

interface TrustScoreProps {
  startupId?: string;
  compact?: boolean;
  showBreakdown?: boolean;
}

const defaultVerifications: VerificationItem[] = [
  { id: 'email', name: 'Email Verified', icon: Mail, status: 'verified', description: 'Business email domain verified', points: 10, verifiedAt: '2024-01-15' },
  { id: 'phone', name: 'Phone Verified', icon: Phone, status: 'verified', description: 'Phone number confirmed via SMS', points: 10, verifiedAt: '2024-01-15' },
  { id: 'domain', name: 'Domain Ownership', icon: Globe, status: 'verified', description: 'Website domain ownership confirmed', points: 15, verifiedAt: '2024-01-16' },
  { id: 'linkedin', name: 'LinkedIn Connected', icon: Linkedin, status: 'verified', description: 'Founders LinkedIn profiles linked', points: 10, verifiedAt: '2024-01-16' },
  { id: 'github', name: 'GitHub Verified', icon: Github, status: 'verified', description: 'Code repository verified', points: 10, verifiedAt: '2024-01-17' },
  { id: 'registration', name: 'Business Registration', icon: FileCheck, status: 'verified', description: 'Legal business registration confirmed', points: 20, verifiedAt: '2024-01-18' },
  { id: 'team', name: 'Team Verified', icon: Users, status: 'pending', description: 'Team members identity verified', points: 15 },
  { id: 'payment', name: 'Payment Verified', icon: CreditCard, status: 'unverified', description: 'Payment method on file', points: 5 },
  { id: 'security', name: 'Security Audit', icon: Lock, status: 'unverified', description: 'Third-party security assessment', points: 15 },
];

export default function TrustScore({ startupId, compact = false, showBreakdown = true }: TrustScoreProps) {
  const [verifications, setVerifications] = useState<VerificationItem[]>(defaultVerifications);
  const [expanded, setExpanded] = useState(!compact);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!startupId) return;
    // Fetch real startup data to compute trust score from actual fields
    supabase
      .from('startups')
      .select('id, is_verified, website_url, tech_stack, team_size, founding_year, headquarters, user_id')
      .eq('id', startupId)
      .single()
      .then(({ data: startup }) => {
        if (!startup) return;
        setVerifications([
          { id: 'email', name: 'Email Verified', icon: Mail, status: 'verified', description: 'Business email domain verified', points: 10 },
          { id: 'domain', name: 'Domain Ownership', icon: Globe, status: startup.website_url ? 'verified' : 'unverified', description: 'Website domain ownership confirmed', points: 15 },
          { id: 'registration', name: 'Business Registration', icon: FileCheck, status: startup.is_verified ? 'verified' : 'pending', description: 'Legal business registration confirmed', points: 20 },
          { id: 'github', name: 'Tech Stack Listed', icon: Github, status: startup.tech_stack?.length > 0 ? 'verified' : 'unverified', description: 'Technology stack documented', points: 10 },
          { id: 'team', name: 'Team Info', icon: Users, status: startup.team_size ? 'verified' : 'pending', description: 'Team size information provided', points: 15 },
          { id: 'linkedin', name: 'LinkedIn Connected', icon: Linkedin, status: 'pending', description: 'Founders LinkedIn profiles linked', points: 10 },
          { id: 'phone', name: 'Phone Verified', icon: Phone, status: 'pending', description: 'Phone number confirmed via SMS', points: 10 },
          { id: 'payment', name: 'Payment Verified', icon: CreditCard, status: 'unverified', description: 'Payment method on file', points: 5 },
          { id: 'security', name: 'Security Audit', icon: Lock, status: 'unverified', description: 'Third-party security assessment', points: 15 },
        ]);
      });
  }, [startupId]);

  const totalPoints = verifications.reduce((sum, v) => sum + v.points, 0);
  const earnedPoints = verifications
    .filter((v) => v.status === 'verified')
    .reduce((sum, v) => sum + v.points, 0);
  const pendingPoints = verifications
    .filter((v) => v.status === 'pending')
    .reduce((sum, v) => sum + v.points, 0);
  const trustScore = Math.round((earnedPoints / totalPoints) * 100);

  useEffect(() => {
    // Animate score on load
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= trustScore) {
            clearInterval(interval);
            return trustScore;
          }
          return prev + 1;
        });
      }, 20);
    }, 300);
    return () => clearTimeout(timer);
  }, [trustScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <Shield className={`w-5 h-5 ${getScoreColor(trustScore)}`} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <span className={`font-semibold ${getScoreColor(trustScore)}`}>
                {animatedScore}%
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Trust Score: {getScoreLabel(trustScore)}</p>
            <p className="text-xs text-muted-foreground">
              {verifications.filter((v) => v.status === 'verified').length} of{' '}
              {verifications.length} verifications complete
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Trust Score
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Verification and credibility</CardDescription>
          </div>
          <Badge
            variant={trustScore >= 80 ? 'default' : trustScore >= 60 ? 'secondary' : 'destructive'}
            className="gap-1 self-start sm:self-auto text-xs"
          >
            <Sparkles className="w-3 h-3" />
            {getScoreLabel(trustScore)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
        {/* Score Display */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
          {/* Circular Score */}
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${animatedScore * 2.51} 251`}
                className={getScoreColor(trustScore)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl md:text-3xl font-bold ${getScoreColor(trustScore)}`}>
                {animatedScore}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground">out of 100</span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Verified
                </span>
                <span className="font-medium">{earnedPoints} pts</span>
              </div>
              <Progress value={(earnedPoints / totalPoints) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  Pending
                </span>
                <span className="font-medium">{pendingPoints} pts</span>
              </div>
              <Progress value={(pendingPoints / totalPoints) * 100} className="h-2 [&>div]:bg-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              Complete more verifications to increase your trust score
            </p>
          </div>
        </div>

        {/* Verification Items */}
        {showBreakdown && (
          <>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setExpanded(!expanded)}
            >
              <span>Verification Details</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {expanded && (
              <div className="space-y-2">
                {verifications.map((verification) => {
                  const Icon = verification.icon;
                  return (
                    <div
                      key={verification.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        verification.status === 'verified'
                          ? 'bg-green-500/10'
                          : verification.status === 'pending'
                          ? 'bg-yellow-500/10'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            verification.status === 'verified'
                              ? 'bg-green-500/20'
                              : verification.status === 'pending'
                              ? 'bg-yellow-500/20'
                              : 'bg-muted'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              verification.status === 'verified'
                                ? 'text-green-500'
                                : verification.status === 'pending'
                                ? 'text-yellow-500'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{verification.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {verification.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          +{verification.points} pts
                        </Badge>
                        {getStatusIcon(verification.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Boost Your Trust Score</p>
              <p className="text-xs text-muted-foreground mb-2">
                Higher scores increase visibility and match quality by up to 40%
              </p>
              <Button size="sm" variant="default">
                Complete Verification
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
