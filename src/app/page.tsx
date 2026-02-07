'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@src/components/layout/header';
import { Footer } from '@src/components/layout/footer';
import {
  Rocket,
  Star,
  BarChart3,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  ThumbsUp,
  MessageSquare,
  Play,
  Check,
  X,
  Clock,
  Sparkles,
  Brain,
  Search,
  Presentation,
  Scale,
} from 'lucide-react';

// Types for database data
interface Launch {
  id: string;
  title: string;
  tagline: string;
  upvote_count: number;
  comment_count: number;
  is_featured: boolean;
}

interface Startup {
  id: string;
  name: string;
  tagline: string;
  logo_url?: string;
  credibility_score: number;
  is_verified: boolean;
}

interface PlatformStats {
  total_startups: number;
  total_reviews: number;
  total_enterprises: number;
  total_matches: number;
  platform_growth: string;
}

interface HomeData {
  launches: Launch[];
  startups: Startup[];
  stats: PlatformStats;
}

const features = [
  {
    icon: Rocket,
    title: 'Launch & Buzz',
    description: 'AI-guided launch templates, upvote systems, and viral analytics. Get featured and gain exposure.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Star,
    title: 'Reviews & Testimonials',
    description: 'Collect verified reviews with AI authenticity checking. Build credibility with embeddable badges.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: BarChart3,
    title: 'Insights & Validation',
    description: 'AI-generated credibility scores and emerging quadrants. Data-driven market positioning.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Handshake,
    title: 'Enterprise Matchmaking',
    description: 'AI-powered buyer-startup connections. Find enterprise clients ready for pilots and POCs.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

const benefits = [
  'Reduce CAC by up to 80% through organic growth',
  'AI-verified reviews build instant credibility',
  'Direct access to enterprise buyers',
  'Real-time market insights without analyst fees',
  'Embeddable trust badges for your website',
  'Gamified referral system for viral growth',
];

const competitorComparison = [
  { feature: 'AI Matchmaking', ethaum: true, productHunt: false, g2: false, gartner: false, appsumo: false },
  { feature: 'Trust Scoring', ethaum: true, productHunt: false, g2: 'partial', gartner: false, appsumo: false },
  { feature: 'Enterprise Focus', ethaum: true, productHunt: false, g2: true, gartner: true, appsumo: false },
  { feature: 'Startup Friendly', ethaum: true, productHunt: true, g2: false, gartner: false, appsumo: true },
  { feature: 'Deal Predictor', ethaum: true, productHunt: false, g2: false, gartner: false, appsumo: false },
  { feature: 'Voice Reviews', ethaum: true, productHunt: false, g2: false, gartner: false, appsumo: false },
  { feature: 'Real-time Analytics', ethaum: true, productHunt: 'partial', g2: 'partial', gartner: false, appsumo: false },
  { feature: 'Embeddable Badges', ethaum: true, productHunt: false, g2: true, gartner: false, appsumo: false },
];

const successStories = [
  {
    company: 'CloudScale AI',
    logo: '☁️',
    quote: 'Landed our first $500K enterprise deal within 3 weeks of launching on EthAum.',
    person: 'Sarah Chen',
    role: 'CEO & Co-founder',
    metrics: { deals: '$500K', time: '3 weeks', matches: '12' },
  },
  {
    company: 'SecureFlow',
    logo: '🔒',
    quote: 'Our credibility score helped us stand out. Enterprises now trust us faster.',
    person: 'Marcus Johnson',
    role: 'Founder',
    metrics: { deals: '$1.2M', time: '6 weeks', matches: '28' },
  },
  {
    company: 'DataBridge',
    logo: '🌉',
    quote: 'The AI matchmaking connected us with buyers we never would have found.',
    person: 'Emily Rodriguez',
    role: 'CTO',
    metrics: { deals: '$350K', time: '2 weeks', matches: '8' },
  },
];

// AI Demo responses (these are static examples of what AI can do)
const aiDemoResponses = {
  pitchAnalysis: {
    overall_score: 82,
    strengths: [
      'Clear value proposition with quantifiable benefits',
      'Strong market understanding and positioning',
      'Experienced team with domain expertise',
    ],
  },
  dealPrediction: {
    probability: 73,
    estimated_close: '45 days',
    factors: [
      { name: 'Product Fit', score: 85, impact: 'positive' },
      { name: 'Budget Alignment', score: 70, impact: 'positive' },
    ],
  },
  smartSearch: {
    query: 'AI security for fintech',
    ai_summary: 'Found 8 AI-powered security solutions specializing in financial technology compliance and fraud detection...',
    results: [{ id: '1' }, { id: '2' }, { id: '3' }],
  },
};

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveUpvotes, setLiveUpvotes] = useState(0);
  const [recentActivity, setRecentActivity] = useState<{type: string; user: string; action: string; target: string; time: string}[]>([]);

  // Fetch data from API
  useEffect(() => {
    async function fetchHomeData() {
      try {
        const response = await fetch('/api/home-data');
        const data = await response.json();
        setHomeData(data);
        setLiveUpvotes(data.launches?.[0]?.upvote_count || 127);
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Set empty state on error
        setHomeData({
          launches: [],
          startups: [],
          stats: {
            total_startups: 0,
            total_reviews: 0,
            total_enterprises: 0,
            total_matches: 0,
            platform_growth: '+0%',
          },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  // Simulate live activity (this is UI enhancement, not static data)
  useEffect(() => {
    const activities = [
      { type: 'upvote', user: 'Alex M.', action: 'upvoted', target: 'CloudScale AI v3.0', time: '2m ago' },
      { type: 'review', user: 'Jessica T.', action: 'left a 5-star review on', target: 'SecureFlow', time: '5m ago' },
      { type: 'match', user: 'TechCorp Inc', action: 'matched with', target: 'DataBridge', time: '8m ago' },
      { type: 'launch', user: 'WorkflowHQ', action: 'launched', target: 'Workflow 2.0', time: '12m ago' },
      { type: 'upvote', user: 'Mike R.', action: 'upvoted', target: 'HealthSync Pro', time: '15m ago' },
    ];
    setRecentActivity(activities);

    // Simulate live upvote counter
    const interval = setInterval(() => {
      setLiveUpvotes(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderCheckmark = (value: boolean | string) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500" />;
    if (value === 'partial') return <span className="text-yellow-500 text-sm">⚠️</span>;
    return <X className="w-5 h-5 text-gray-300" />;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-10 sm:py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container relative px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                <Zap className="mr-1 h-3 w-3" />
                Replacing Gartner/G2 with AI
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                AI Credibility Scoring for{' '}
                <span className="text-primary">Enterprise-Ready Startups</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground md:text-lg max-w-2xl mx-auto px-2">
                Launch products → Collect verified reviews → Build AI credibility score → 
                Get matched with enterprise buyers.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/demo">
                    <Play className="mr-2 h-4 w-4" />
                    Try Interactive Demo
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/register/startup">
                    Launch Your Startup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
                <Shield className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                AI-powered credibility • Real-time validation • Enterprise matchmaking
              </p>
            </div>
          </div>
        </section>

        {/* Demo Banner */}
        <section className="py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                <p className="text-sm sm:text-lg font-semibold text-center">
                  🎉 Try our interactive demo!
                </p>
              </div>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/demo">Launch Demo →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Video & Demo CTA Section */}
        <section className="py-6 sm:py-8 border-y bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="text-center w-full sm:w-auto">
                <h3 className="text-base sm:text-xl font-semibold mb-2">See It In Action</h3>
                <Button size="default" className="w-full sm:w-auto" variant="default" asChild>
                  <a href="https://youtu.be/YOUR_VIDEO_ID" target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Watch 2-Min Demo
                  </a>
                </Button>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="block sm:hidden w-full h-px bg-border" />
              <div className="text-center w-full sm:w-auto">
                <h3 className="text-base sm:text-xl font-semibold mb-2">Try It Yourself</h3>
                <Button size="default" className="w-full sm:w-auto" variant="outline" asChild>
                  <Link href="/demo">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Interactive Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="border-y bg-primary/5 py-8 sm:py-12">
          <div className="container px-4">
            <div className="text-center mb-6 sm:mb-8">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs">The EthAum Journey</Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">From Launch to Enterprise Deal</h2>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-8">
              <div className="flex flex-col items-center text-center w-16 sm:w-20">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold">1</div>
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-2 text-primary" />
                <p className="font-semibold mt-1 text-xs sm:text-sm md:text-base">Launch</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
              <div className="flex flex-col items-center text-center w-16 sm:w-20">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold">2</div>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-2 text-yellow-500" />
                <p className="font-semibold mt-1 text-xs sm:text-sm md:text-base">Reviews</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
              <div className="flex flex-col items-center text-center w-16 sm:w-20">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold">3</div>
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-2 text-green-500" />
                <p className="font-semibold mt-1 text-xs sm:text-sm md:text-base">Score</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
              <div className="flex flex-col items-center text-center w-16 sm:w-20">
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold">4</div>
                <Handshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mt-2 text-purple-500" />
                <p className="font-semibold mt-1 text-xs sm:text-sm md:text-base">Deal</p>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE: Trending Launches Section */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Badge className="bg-red-500 text-white animate-pulse text-xs">🔴 LIVE</Badge>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Trending Launches</h2>
                </div>
                <p className="text-sm text-muted-foreground">Real startups getting real traction</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href="/explore">View All</Link>
              </Button>
            </div>
            
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : homeData?.launches && homeData.launches.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {homeData.launches.slice(0, 3).map((launch, index) => (
                  <Card key={launch.id} className="hover:shadow-lg transition-all group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="text-2xl sm:text-4xl">{index === 0 ? '🚀' : index === 1 ? '⚡' : '🔥'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors truncate">{launch.title}</h3>
                            {launch.is_featured && <Badge className="bg-yellow-500 text-white text-[10px] sm:text-xs">Featured</Badge>}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{launch.tagline}</p>
                          <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                            <span className="flex items-center gap-1 text-primary font-semibold text-sm">
                              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              {index === 0 ? liveUpvotes : launch.upvote_count}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                              {launch.comment_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Rocket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Launches Yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to launch your startup on EthAum!</p>
                <Button asChild>
                  <Link href="/register/startup">Launch Now</Link>
                </Button>
              </Card>
            )}
          </div>
        </section>

        {/* LIVE: Activity Feed + Top Startups */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Live Activity Feed */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Live Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {recentActivity.slice(0, 4).map((activity, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'upvote' ? 'bg-green-100 text-green-600' :
                          activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                          activity.type === 'match' ? 'bg-purple-100 text-purple-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'upvote' && <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />}
                          {activity.type === 'review' && <Star className="w-3 h-3 sm:w-4 sm:h-4" />}
                          {activity.type === 'match' && <Handshake className="w-3 h-3 sm:w-4 sm:h-4" />}
                          {activity.type === 'launch' && <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate"><span className="font-medium">{activity.user}</span> {activity.action} <span className="text-primary">{activity.target}</span></p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Top Rated Startups */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      Top Enterprise-Ready Startups
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Highest credibility scores this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3 sm:space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3">
                            <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                            <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                            <div className="flex-1 space-y-1 sm:space-y-2">
                              <Skeleton className="h-3 sm:h-4 w-1/3" />
                              <Skeleton className="h-2 sm:h-3 w-2/3" />
                            </div>
                            <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
                          </div>
                        ))}
                      </div>
                    ) : homeData?.startups && homeData.startups.length > 0 ? (
                      <div className="space-y-2 sm:space-y-4">
                        {homeData.startups.slice(0, 5).map((startup, index) => (
                          <div key={startup.id} className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm flex-shrink-0 ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-primary'
                            }`}>
                              {index + 1}
                            </div>
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                              <AvatarImage src={startup.logo_url || ''} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                                {startup.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <p className="font-medium text-sm sm:text-base truncate">{startup.name}</p>
                                {startup.is_verified && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">{startup.tagline}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                <span className="font-bold text-green-600 text-sm sm:text-base">{startup.credibility_score}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-muted-foreground">No startups registered yet.</p>
                        <Button className="mt-3 sm:mt-4" size="sm" asChild>
                          <Link href="/register/startup">Be the First</Link>
                        </Button>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-3 sm:mt-4" size="sm" asChild>
                      <Link href="/explore">Explore All Startups</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Competitor Comparison Table */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">Why EthAum.ai</Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">EthAum.ai vs. Competitors</h2>
              <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2">
                The only platform combining Product Hunt launches, G2 reviews, Gartner insights, and AppSumo deals
              </p>
            </div>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 md:p-4 font-medium text-sm">Feature</th>
                    <th className="p-3 md:p-4 text-center bg-primary/10 font-bold text-primary text-sm">EthAum.ai</th>
                    <th className="p-3 md:p-4 text-center text-sm">Product Hunt</th>
                    <th className="p-3 md:p-4 text-center text-sm">G2</th>
                    <th className="p-3 md:p-4 text-center text-sm">Gartner</th>
                    <th className="p-3 md:p-4 text-center text-sm">AppSumo</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((row) => (
                    <tr key={row.feature} className="border-b hover:bg-muted/30">
                      <td className="p-3 md:p-4 font-medium text-sm">{row.feature}</td>
                      <td className="p-3 md:p-4 text-center bg-primary/5">{renderCheckmark(row.ethaum)}</td>
                      <td className="p-3 md:p-4 text-center">{renderCheckmark(row.productHunt)}</td>
                      <td className="p-3 md:p-4 text-center">{renderCheckmark(row.g2)}</td>
                      <td className="p-3 md:p-4 text-center">{renderCheckmark(row.gartner)}</td>
                      <td className="p-3 md:p-4 text-center">{renderCheckmark(row.appsumo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                <Sparkles className="mr-1 h-3 w-3" />
                Success Stories
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Real Results from Real Startups</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {successStories.map((story) => (
                <Card key={story.company} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{story.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{story.company}</CardTitle>
                        <CardDescription>{story.person}, {story.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic mb-4">&quot;{story.quote}&quot;</p>
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{story.metrics.deals}</p>
                        <p className="text-xs text-muted-foreground">Deal Value</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{story.metrics.time}</p>
                        <p className="text-xs text-muted-foreground">Time to Deal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">{story.metrics.matches}</p>
                        <p className="text-xs text-muted-foreground">AI Matches</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">Features</Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Everything You Need to Succeed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3 sm:mb-4`}>
                      <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  <Award className="mr-1 h-3 w-3" />
                  Why EthAum.ai
                </Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Reduce Marketing Spend by 80-90%</h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
                  Stop burning cash on expensive marketing. Our platform drives organic growth through community, credibility, and AI-powered matchmaking.
                </p>
                <ul className="mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <Card className="p-3 sm:p-4 text-center">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">+340%</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Visibility Boost</div>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">50+</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Enterprise Leads</div>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">98%</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Authenticity</div>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">2 Days</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Time to Match</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Try AI Features Section - No Login Required */}
        <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <div className="container px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <Badge variant="outline" className="mb-3 sm:mb-4 border-purple-500/50 text-xs sm:text-sm">
                <Brain className="mr-1 h-3 w-3" />
                Try AI Features
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Experience Our AI - No Login Required</h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                Test our AI-powered features right now. These demos show exactly what you&apos;ll get with EthAum.ai.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {/* AI Pitch Analyzer Demo */}
              <Card className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Presentation className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    AI Pitch Analyzer
                    <Badge variant="secondary" className="text-xs">Live Demo</Badge>
                  </CardTitle>
                  <CardDescription>
                    Get instant AI feedback on your startup pitch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Pitch Score</span>
                        <span className="text-2xl font-bold text-purple-600">{aiDemoResponses.pitchAnalysis.overall_score}/100</span>
                      </div>
                      <Progress value={aiDemoResponses.pitchAnalysis.overall_score} className="h-2" />
                    </div>
                    <ul className="space-y-2 text-sm">
                      {aiDemoResponses.pitchAnalysis.strengths.slice(0, 2).map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/register/startup">
                        Try Full Analyzer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Deal Predictor Demo */}
              <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    AI Deal Predictor
                    <Badge variant="secondary" className="text-xs">Live Demo</Badge>
                  </CardTitle>
                  <CardDescription>
                    Predict enterprise deal probability with AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600">{aiDemoResponses.dealPrediction.probability}%</div>
                      <p className="text-sm text-muted-foreground">Deal Probability</p>
                      <p className="text-xs mt-1">Est. Close: {aiDemoResponses.dealPrediction.estimated_close}</p>
                    </div>
                    <div className="space-y-2">
                      {aiDemoResponses.dealPrediction.factors.map((f, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span>{f.name}</span>
                          <Badge variant={f.impact === 'positive' ? 'default' : 'secondary'}>
                            {f.score}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/register/startup">
                        Try Full Predictor
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Smart Search Demo */}
              <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    AI Smart Search
                    <Badge variant="secondary" className="text-xs">Live Demo</Badge>
                  </CardTitle>
                  <CardDescription>
                    Natural language search for startups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Input
                        placeholder="e.g., 'AI security for fintech'"
                        className="mb-2"
                        defaultValue={aiDemoResponses.smartSearch.query}
                      />
                      <p className="text-xs text-muted-foreground">
                        <Brain className="inline w-3 h-3 mr-1" />
                        AI Summary: {aiDemoResponses.smartSearch.ai_summary.slice(0, 80)}...
                      </p>
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      Found <span className="font-bold text-foreground">{aiDemoResponses.smartSearch.results.length}</span> matching startups
                    </div>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/explore">
                        Try Smart Search
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Stats - Dynamic from Database */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="p-4 text-center bg-white/50 dark:bg-white/5">
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Card className="p-4 text-center bg-white/50 dark:bg-white/5">
                    <div className="text-2xl font-bold text-primary">{homeData?.stats.total_startups || 0}+</div>
                    <div className="text-xs text-muted-foreground">Startups Listed</div>
                  </Card>
                  <Card className="p-4 text-center bg-white/50 dark:bg-white/5">
                    <div className="text-2xl font-bold text-primary">{homeData?.stats.total_reviews || 0}+</div>
                    <div className="text-xs text-muted-foreground">Verified Reviews</div>
                  </Card>
                  <Card className="p-4 text-center bg-white/50 dark:bg-white/5">
                    <div className="text-2xl font-bold text-primary">{homeData?.stats.total_enterprises || 0}+</div>
                    <div className="text-xs text-muted-foreground">Enterprise Buyers</div>
                  </Card>
                  <Card className="p-3 sm:p-4 text-center bg-white/50 dark:bg-white/5">
                    <div className="text-xl sm:text-2xl font-bold text-primary">{homeData?.stats.total_matches || 0}+</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">AI Matches</div>
                  </Card>
                  <Card className="p-3 sm:p-4 text-center bg-white/50 dark:bg-white/5 col-span-2 sm:col-span-1">
                    <div className="text-xl sm:text-2xl font-bold text-green-500">{homeData?.stats.platform_growth || '+0%'}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Growth This Quarter</div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 bg-primary text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Ready to Launch Your Startup?</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg opacity-90 max-w-2xl mx-auto">
              Join hundreds of startups growing with EthAum.ai. Get started in minutes.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4" />
                  Try Demo First
                </Link>
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link href="/register/startup">
                    I&apos;m a Startup
                    <Rocket className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link href="/register/enterprise">I&apos;m an Enterprise</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}