'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  Scale,
  Zap,
  Shield,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

interface ComparisonStartup {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  category: string;
  score: number;
  features: string[];
  pricing: string;
  founded: string;
  teamSize: string;
  funding: string;
  pros: string[];
  cons: string[];
  ratings: {
    overall: number;
    easeOfUse: number;
    support: number;
    value: number;
    features: number;
  };
}

const demoStartups: ComparisonStartup[] = [
  {
    id: '1',
    name: 'CloudSync Pro',
    logo: '☁️',
    tagline: 'Enterprise cloud data synchronization',
    category: 'Cloud Infrastructure',
    score: 92,
    features: ['Real-time sync', 'Multi-cloud support', 'Enterprise SSO', 'API access', 'Custom integrations'],
    pricing: '$99/month',
    founded: '2021',
    teamSize: '25-50',
    funding: '$5.2M Series A',
    pros: ['Excellent uptime', 'Great support', 'Scalable'],
    cons: ['Steep learning curve', 'Limited free tier'],
    ratings: { overall: 4.5, easeOfUse: 4.0, support: 4.8, value: 4.3, features: 4.6 },
  },
  {
    id: '2',
    name: 'DataFlow AI',
    logo: '🌊',
    tagline: 'AI-powered data pipeline automation',
    category: 'Data Analytics',
    score: 88,
    features: ['AI automation', 'Visual workflows', 'Real-time analytics', 'Data quality', 'Team collaboration'],
    pricing: '$149/month',
    founded: '2022',
    teamSize: '10-25',
    funding: '$3.1M Seed',
    pros: ['Innovative AI features', 'Beautiful UI', 'Fast onboarding'],
    cons: ['Higher price point', 'Newer company'],
    ratings: { overall: 4.3, easeOfUse: 4.6, support: 4.2, value: 4.0, features: 4.5 },
  },
  {
    id: '3',
    name: 'SecureVault',
    logo: '🔒',
    tagline: 'Zero-trust security platform',
    category: 'Cybersecurity',
    score: 95,
    features: ['Zero-trust architecture', 'Threat detection', 'Compliance tools', 'Audit logs', 'SSO integration'],
    pricing: '$199/month',
    founded: '2020',
    teamSize: '50-100',
    funding: '$12M Series B',
    pros: ['Industry-leading security', 'Compliance ready', 'Excellent documentation'],
    cons: ['Complex setup', 'Premium pricing'],
    ratings: { overall: 4.7, easeOfUse: 3.8, support: 4.6, value: 4.2, features: 4.9 },
  },
];

export default function CompareToolPage() {
  const [selectedStartups, setSelectedStartups] = useState<ComparisonStartup[]>([]);
  const [availableStartups, setAvailableStartups] = useState<ComparisonStartup[]>(demoStartups);
  const [aiComparison, setAiComparison] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    winner: string;
    reason: string;
    bestFor: Record<string, string>;
  } | null>(null);

  const addStartup = (id: string) => {
    if (selectedStartups.length >= 3) {
      toast.error('You can compare up to 3 startups at a time');
      return;
    }
    const startup = availableStartups.find((s) => s.id === id);
    if (startup && !selectedStartups.find((s) => s.id === id)) {
      setSelectedStartups([...selectedStartups, startup]);
    }
  };

  const removeStartup = (id: string) => {
    setSelectedStartups(selectedStartups.filter((s) => s.id !== id));
    setAiComparison(null);
    setRecommendation(null);
  };

  const getAiComparison = async () => {
    if (selectedStartups.length < 2) {
      toast.error('Select at least 2 startups to compare');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startups: selectedStartups }),
      });

      if (!response.ok) throw new Error('Comparison failed');

      const data = await response.json();
      setAiComparison(data.comparison);
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error('AI comparison error:', error);
      // Demo comparison
      setAiComparison(
        `Based on comprehensive analysis of ${selectedStartups.map(s => s.name).join(', ')}:\n\n` +
        `All three solutions offer compelling value propositions for different use cases. ` +
        `CloudSync Pro excels in enterprise reliability with exceptional uptime guarantees. ` +
        `DataFlow AI brings innovative AI-powered automation that can significantly reduce manual work. ` +
        `SecureVault leads in security features, making it ideal for compliance-heavy industries.\n\n` +
        `For pure data operations, CloudSync Pro offers the best balance of features and pricing. ` +
        `Organizations prioritizing innovation should consider DataFlow AI. ` +
        `Enterprises with strict security requirements would benefit most from SecureVault.`
      );
      setRecommendation({
        winner: selectedStartups[0].name,
        reason: 'Best overall value for most enterprise use cases with proven reliability and competitive pricing.',
        bestFor: {
          'Budget-conscious teams': selectedStartups[0]?.name || 'N/A',
          'Innovation-focused': selectedStartups[1]?.name || selectedStartups[0].name,
          'Security-first': selectedStartups[2]?.name || selectedStartups[0].name,
        },
      });
      toast.info('Showing demo comparison');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const CompareIndicator = ({ value1, value2, label }: { value1: number; value2: number; label: string }) => {
    const diff = value1 - value2;
    return (
      <div className="flex items-center justify-center gap-1">
        {diff > 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : diff < 0 ? (
          <TrendingDown className="w-4 h-4 text-red-500" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="px-2 md:px-3">
                  <ArrowLeft className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Scale className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  Smart Compare
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  AI-powered startup comparison
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1 self-start sm:self-auto">
              <Sparkles className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Startup Selector */}
        <Card className="mb-4 md:mb-8">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Select Startups to Compare</CardTitle>
            <CardDescription className="text-sm">
              Choose up to 3 startups for comparison
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-start sm:items-center">
              {selectedStartups.map((startup) => (
                <Badge
                  key={startup.id}
                  variant="secondary"
                  className="text-sm md:text-base py-1.5 md:py-2 px-3 md:px-4 gap-2"
                >
                  <span className="text-xl">{startup.logo}</span>
                  {startup.name}
                  <button
                    onClick={() => removeStartup(startup.id)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
              
              {selectedStartups.length < 3 && (
                <Select onValueChange={addStartup}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add startup..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStartups
                      .filter((s) => !selectedStartups.find((ss) => ss.id === s.id))
                      .map((startup) => (
                        <SelectItem key={startup.id} value={startup.id}>
                          <span className="flex items-center gap-2">
                            <span>{startup.logo}</span>
                            {startup.name}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}

              {selectedStartups.length >= 2 && (
                <Button onClick={getAiComparison} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get AI Comparison
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedStartups.length >= 2 && (
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedStartups.length}, 1fr)` }}>
              {selectedStartups.map((startup) => (
                <Card key={startup.id} className="relative overflow-hidden">
                  {startup.score >= 90 && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-black gap-1">
                        <Star className="w-3 h-3" />
                        Top Rated
                      </Badge>
                    </div>
                  )}
                  <CardContent className="pt-6 text-center">
                    <div className="text-5xl mb-4">{startup.logo}</div>
                    <h3 className="text-xl font-bold">{startup.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{startup.tagline}</p>
                    <Badge variant="outline">{startup.category}</Badge>
                    
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">{startup.score}</div>
                      <div className="text-sm text-muted-foreground">EthAum Score</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ratings Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Ratings Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['overall', 'easeOfUse', 'support', 'value', 'features'].map((metric) => (
                    <div key={metric} className="grid gap-4 items-center" style={{ gridTemplateColumns: `150px repeat(${selectedStartups.length}, 1fr)` }}>
                      <div className="text-sm font-medium capitalize">
                        {metric === 'easeOfUse' ? 'Ease of Use' : metric}
                      </div>
                      {selectedStartups.map((startup) => {
                        const rating = startup.ratings[metric as keyof typeof startup.ratings];
                        const isHighest = rating === Math.max(...selectedStartups.map(s => s.ratings[metric as keyof typeof s.ratings]));
                        return (
                          <div key={startup.id} className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isHighest ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                style={{ width: `${(rating / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${isHighest ? 'text-primary' : ''}`}>
                              {rating.toFixed(1)}
                            </span>
                            {isHighest && <CheckCircle className="w-4 h-4 text-primary" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Key Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Pricing', key: 'pricing', icon: DollarSign },
                    { label: 'Founded', key: 'founded', icon: Rocket },
                    { label: 'Team Size', key: 'teamSize', icon: Users },
                    { label: 'Funding', key: 'funding', icon: TrendingUp },
                  ].map(({ label, key, icon: Icon }) => (
                    <div key={key} className="grid gap-4 items-center" style={{ gridTemplateColumns: `150px repeat(${selectedStartups.length}, 1fr)` }}>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {label}
                      </div>
                      {selectedStartups.map((startup) => (
                        <div key={startup.id} className="text-sm">
                          {startup[key as keyof ComparisonStartup] as string}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedStartups.length}, 1fr)` }}>
                  {selectedStartups.map((startup) => (
                    <div key={startup.id} className="space-y-2">
                      {startup.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedStartups.length}, 1fr)` }}>
              {selectedStartups.map((startup) => (
                <Card key={startup.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{startup.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-500 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {startup.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-500 mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {startup.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <XCircle className="w-3 h-3 text-red-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Analysis */}
            {aiComparison && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Comparison Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground whitespace-pre-line">{aiComparison}</p>

                  {recommendation && (
                    <div className="bg-primary/10 rounded-lg p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        AI Recommendation
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <Badge className="text-base py-1 px-3">{recommendation.winner}</Badge>
                          <p className="text-sm text-muted-foreground mt-2">{recommendation.reason}</p>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Best for specific needs:</p>
                          <div className="grid gap-2">
                            {Object.entries(recommendation.bestFor).map(([need, startup]) => (
                              <div key={need} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{need}</span>
                                <Badge variant="outline">{startup}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {selectedStartups.length < 2 && (
          <Card className="text-center py-16">
            <CardContent>
              <Scale className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select Startups to Compare</h3>
              <p className="text-muted-foreground mb-6">
                Choose at least 2 startups from the dropdown above to see a detailed comparison
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Side-by-side comparison
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI-powered analysis
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Smart recommendations
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
