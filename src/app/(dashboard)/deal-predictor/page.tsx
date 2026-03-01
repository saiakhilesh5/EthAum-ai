'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';

interface StartupProfile {
  id: string;
  name: string;
  tagline: string;
  logo_url: string | null;
  industry: string;
  stage: string;
  arr_range: string;
  team_size: string;
  headquarters: string;
  credibility_score: number;
  tech_stack: string[];
  use_cases: string[];
}

interface EnterpriseProfile {
  id: string;
  company_name: string;
  logo_url: string | null;
  industry: string;
  company_size: string;
  headquarters: string;
  looking_for: string[];
  budget_range: string;
}

interface DealPrediction {
  successProbability: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  estimatedTimeToClose: string;
  dealValueRange: string;
  positiveFactors: string[];
  riskFactors: string[];
  nextSteps: string[];
  similarDeals: {
    company: string;
    outcome: 'success' | 'failed';
    timeline: string;
  }[];
}

export default function DealPredictorPage() {
  const { user } = useUser();
  const [userType, setUserType] = useState<'startup' | 'enterprise' | null>(null);
  const [userProfile, setUserProfile] = useState<StartupProfile | EnterpriseProfile | null>(null);
  const [potentialPartners, setPotentialPartners] = useState<(StartupProfile | EnterpriseProfile)[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<StartupProfile | EnterpriseProfile | null>(null);
  const [prediction, setPrediction] = useState<DealPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Check both startup and enterprise profiles in parallel
      const [startupResult, enterpriseResult] = await Promise.all([
        supabase.from('startups').select('*').eq('user_id', user.id).single(),
        supabase.from('enterprises').select('*').eq('user_id', user.id).single(),
      ]);

      if (startupResult.data) {
        setUserType('startup');
        setUserProfile(startupResult.data);
        // Fetch enterprises as potential partners
        const { data: enterprises } = await supabase.from('enterprises').select('*').limit(10);
        setPotentialPartners(enterprises || []);
      } else if (enterpriseResult.data) {
        setUserType('enterprise');
        setUserProfile(enterpriseResult.data);
        // Fetch startups as potential partners
        const { data: startups } = await supabase.from('startups').select('*').limit(10);
        setPotentialPartners(startups || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const predictDeal = async (partner: StartupProfile | EnterpriseProfile) => {
    setSelectedPartner(partner);
    setIsPredicting(true);

    try {
      const response = await fetch('/api/ai/predict-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          partnerProfile: partner,
          userType,
        }),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error('Error predicting deal:', error);
      // Demo prediction
      setPrediction(generateDemoPrediction());
      toast.info('Showing demo prediction');
    } finally {
      setIsPredicting(false);
    }
  };

  const generateDemoPrediction = (): DealPrediction => ({
    successProbability: 78,
    confidenceLevel: 'high',
    estimatedTimeToClose: '4-6 weeks',
    dealValueRange: '$50,000 - $150,000',
    positiveFactors: [
      'Strong industry alignment (SaaS/Technology)',
      'Compatible company sizes for pilot programs',
      'Matching technology requirements and capabilities',
      'Previous successful partnerships in similar space',
      'Budget range aligns with typical contract values',
    ],
    riskFactors: [
      'Geographic distance may slow onboarding',
      'Enterprise has ongoing vendor evaluations',
      'Technical integration complexity is moderate',
    ],
    nextSteps: [
      'Schedule discovery call within 48 hours',
      'Prepare customized demo for their use case',
      'Share case studies from similar customers',
      'Propose pilot program structure',
      'Connect technical teams for architecture review',
    ],
    similarDeals: [
      { company: 'TechCorp Inc', outcome: 'success', timeline: '5 weeks' },
      { company: 'DataFirst LLC', outcome: 'success', timeline: '3 weeks' },
      { company: 'CloudNine Solutions', outcome: 'failed', timeline: '8 weeks' },
    ],
  });

  const getConfidenceBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-green-500">High Confidence</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium Confidence</Badge>;
      default:
        return <Badge className="bg-orange-500">Low Confidence</Badge>;
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-500';
    if (prob >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Skeleton className="h-64 md:h-96" />
          <Skeleton className="h-64 md:h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Complete Your Profile First</h2>
            <p className="text-muted-foreground mb-4">
              Create your profile to use the AI Deal Predictor
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/profile/startup">Startup Profile</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/profile/enterprise">Enterprise Profile</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          AI Deal Predictor
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Predict partnership success with AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Partner Selection */}
        <Card className="order-2 lg:order-1">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg">Select {userType === 'startup' ? 'Enterprise' : 'Startup'}</CardTitle>
            <CardDescription className="text-sm">
              Choose a partner to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
            {potentialPartners.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No potential partners found. Check back later!
              </p>
            ) : (
              potentialPartners.map((partner) => {
                const isStartup = 'name' in partner;
                return (
                  <div
                    key={partner.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPartner?.id === partner.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => predictDeal(partner)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={partner.logo_url || ''} />
                        <AvatarFallback>
                          {(isStartup ? (partner as StartupProfile).name : (partner as EnterpriseProfile).company_name)
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {isStartup
                            ? (partner as StartupProfile).name
                            : (partner as EnterpriseProfile).company_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {partner.industry}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Prediction Results */}
        <div className="lg:col-span-2 space-y-6">
          {isPredicting ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="font-medium">Analyzing compatibility...</p>
                <p className="text-sm text-muted-foreground">
                  Our AI is evaluating multiple factors
                </p>
              </CardContent>
            </Card>
          ) : prediction && selectedPartner ? (
            <>
              {/* Main Prediction */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedPartner.logo_url || ''} />
                        <AvatarFallback>
                          {'name' in selectedPartner
                            ? selectedPartner.name.substring(0, 2).toUpperCase()
                            : selectedPartner.company_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>
                          {'name' in selectedPartner
                            ? selectedPartner.name
                            : selectedPartner.company_name}
                        </CardTitle>
                        <CardDescription>{selectedPartner.industry}</CardDescription>
                      </div>
                    </div>
                    {getConfidenceBadge(prediction.confidenceLevel)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Success Probability */}
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${prediction.successProbability * 2.51} 251`}
                            className={getProbabilityColor(prediction.successProbability)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-2xl font-bold ${getProbabilityColor(prediction.successProbability)}`}>
                            {prediction.successProbability}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-2">Success Probability</p>
                    </div>

                    {/* Time to Close */}
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-bold">{prediction.estimatedTimeToClose}</p>
                      <p className="text-xs text-muted-foreground">Est. Time to Close</p>
                    </div>

                    {/* Deal Value */}
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="font-bold">{prediction.dealValueRange}</p>
                      <p className="text-xs text-muted-foreground">Potential Value</p>
                    </div>

                    {/* Similar Deals Success */}
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-bold">
                        {prediction.similarDeals.filter(d => d.outcome === 'success').length}/
                        {prediction.similarDeals.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Similar Deals Won</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Factors */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-500 flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      Positive Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.positiveFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-500 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.riskFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Recommended Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {prediction.nextSteps.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Similar Deals */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Past Deals</CardTitle>
                  <CardDescription>
                    Outcomes from comparable partnerships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {prediction.similarDeals.map((deal, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          deal.outcome === 'success'
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-red-500/50 bg-red-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{deal.company}</span>
                          <Badge
                            className={
                              deal.outcome === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }
                          >
                            {deal.outcome === 'success' ? 'Won' : 'Lost'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Closed in {deal.timeline}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Select a Partner</h3>
                <p className="text-muted-foreground">
                  Choose a {userType === 'startup' ? 'enterprise' : 'startup'} from the list
                  to predict deal success
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
