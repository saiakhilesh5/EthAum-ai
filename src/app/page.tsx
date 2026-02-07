'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@src/components/layout/header';
import { Footer } from '@src/components/layout/footer';
import { DEMO_STARTUPS, DEMO_LAUNCHES } from '@src/lib/demo-data';
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
  Target,
  Award,
  ThumbsUp,
  MessageSquare,
  Play,
  Check,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

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

export default function HomePage() {
  const [trendingLaunches] = useState(DEMO_LAUNCHES);
  const [topStartups] = useState(DEMO_STARTUPS.slice(0, 5));
  const [recentActivity, setRecentActivity] = useState<{type: string; user: string; action: string; target: string; time: string}[]>([]);
  const [liveUpvotes, setLiveUpvotes] = useState(DEMO_LAUNCHES[0]?.upvote_count || 127);

  // Simulate live activity
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
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Zap className="mr-1 h-3 w-3" />
                Replacing Gartner/G2 with AI
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                AI Credibility Scoring for{' '}
                <span className="text-primary">Enterprise-Ready Startups</span>
              </h1>
              <p className="mt-6 text-base text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Launch products → Collect verified reviews → Build AI credibility score → 
                Get matched with enterprise buyers. The complete journey from startup to enterprise deal.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register/startup">
                    Launch Your Startup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    <Play className="mr-2 h-4 w-4" />
                    Try Demo (No Signup)
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <Shield className="inline w-4 h-4 mr-1" />
                AI-powered credibility • Real-time validation • Enterprise matchmaking
              </p>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="border-y bg-primary/5 py-12">
          <div className="container">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">The EthAum Journey</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">From Launch to Enterprise Deal</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">1</div>
                <Rocket className="w-6 h-6 mt-3 text-primary" />
                <p className="font-semibold mt-2">Launch</p>
                <p className="text-xs text-muted-foreground">Product launches</p>
              </div>
              <ArrowRight className="hidden md:block w-8 h-8 text-primary" />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">2</div>
                <Star className="w-6 h-6 mt-3 text-yellow-500" />
                <p className="font-semibold mt-2">Reviews</p>
                <p className="text-xs text-muted-foreground">Verified feedback</p>
              </div>
              <ArrowRight className="hidden md:block w-8 h-8 text-primary" />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">3</div>
                <BarChart3 className="w-6 h-6 mt-3 text-green-500" />
                <p className="font-semibold mt-2">Credibility</p>
                <p className="text-xs text-muted-foreground">AI-computed score</p>
              </div>
              <ArrowRight className="hidden md:block w-8 h-8 text-primary" />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold">4</div>
                <Handshake className="w-6 h-6 mt-3 text-purple-500" />
                <p className="font-semibold mt-2">Enterprise Deal</p>
                <p className="text-xs text-muted-foreground">AI matchmaking</p>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE: Trending Launches Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold">Trending Launches Today</h2>
                </div>
                <p className="text-muted-foreground">Real startups getting real traction right now</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/explore">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingLaunches.slice(0, 3).map((launch, index) => (
                <Card key={launch.id} className="hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{index === 0 ? '🚀' : index === 1 ? '⚡' : '🔥'}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{launch.title}</h3>
                          {launch.is_featured && <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{launch.tagline}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <span className="flex items-center gap-1 text-primary font-semibold">
                            <ThumbsUp className="w-4 h-4" />
                            {index === 0 ? liveUpvotes : launch.upvote_count}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MessageSquare className="w-4 h-4" />
                            {launch.comment_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* LIVE: Activity Feed + Top Startups */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Live Activity Feed */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Live Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'upvote' ? 'bg-green-100 text-green-600' :
                          activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                          activity.type === 'match' ? 'bg-purple-100 text-purple-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'upvote' && <ThumbsUp className="w-4 h-4" />}
                          {activity.type === 'review' && <Star className="w-4 h-4" />}
                          {activity.type === 'match' && <Handshake className="w-4 h-4" />}
                          {activity.type === 'launch' && <Rocket className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p><span className="font-medium">{activity.user}</span> {activity.action} <span className="text-primary">{activity.target}</span></p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Top Rated Startups */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Top Rated Enterprise-Ready Startups
                    </CardTitle>
                    <CardDescription>Highest credibility scores this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topStartups.map((startup, index) => (
                        <div key={startup.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={startup.logo_url || ''} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {startup.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{startup.name}</p>
                              {startup.is_verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{startup.tagline}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="font-bold text-green-600">{startup.credibility_score}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Credibility</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href="/explore">Explore All Startups</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Competitor Comparison Table */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Why EthAum.ai</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">EthAum.ai vs. Competitors</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                The only platform combining Product Hunt launches, G2 reviews, Gartner insights, and AppSumo deals
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="p-4 text-center bg-primary/10 font-bold text-primary">EthAum.ai</th>
                    <th className="p-4 text-center">Product Hunt</th>
                    <th className="p-4 text-center">G2</th>
                    <th className="p-4 text-center">Gartner</th>
                    <th className="p-4 text-center">AppSumo</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((row) => (
                    <tr key={row.feature} className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center bg-primary/5">{renderCheckmark(row.ethaum)}</td>
                      <td className="p-4 text-center">{renderCheckmark(row.productHunt)}</td>
                      <td className="p-4 text-center">{renderCheckmark(row.g2)}</td>
                      <td className="p-4 text-center">{renderCheckmark(row.gartner)}</td>
                      <td className="p-4 text-center">{renderCheckmark(row.appsumo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Success Stories
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Real Results from Real Startups</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
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
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Everything You Need to Succeed</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Award className="mr-1 h-3 w-3" />
                  Why EthAum.ai
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold">Reduce Marketing Spend by 80-90%</h2>
                <p className="mt-4 text-muted-foreground">
                  Stop burning cash on expensive marketing. Our platform drives organic growth through community, credibility, and AI-powered matchmaking.
                </p>
                <ul className="mt-8 space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">+340%</div>
                  <div className="text-xs text-muted-foreground">Avg. Visibility Boost</div>
                </Card>
                <Card className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-xs text-muted-foreground">Enterprise Leads/Mo</div>
                </Card>
                <Card className="p-4 text-center">
                  <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-xs text-muted-foreground">Review Authenticity</div>
                </Card>
                <Card className="p-4 text-center">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">2 Days</div>
                  <div className="text-xs text-muted-foreground">Avg. Time to Match</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Launch Your Startup?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join hundreds of startups already growing with EthAum.ai. Get started in minutes, no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/startup">
                  I&apos;m a Startup
                  <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/register/enterprise">I&apos;m an Enterprise Buyer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}