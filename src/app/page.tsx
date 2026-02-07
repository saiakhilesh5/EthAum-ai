import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Target,
  Award,
} from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Launch & Buzz',
    description:
      'AI-guided launch templates, upvote systems, and viral analytics. Get featured and gain exposure.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Star,
    title: 'Reviews & Testimonials',
    description:
      'Collect verified reviews with AI authenticity checking. Build credibility with embeddable badges.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: BarChart3,
    title: 'Insights & Validation',
    description:
      'AI-generated credibility scores and emerging quadrants. Data-driven market positioning.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Handshake,
    title: 'Enterprise Matchmaking',
    description:
      'AI-powered buyer-startup connections. Find enterprise clients ready for pilots and POCs.',
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

const stats = [
  { value: '500+', label: 'Startups Launched' },
  { value: '$2.5M+', label: 'Deals Facilitated' },
  { value: '10K+', label: 'Reviews Collected' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const targetAudience = [
  {
    stage: 'Series A',
    arr: '$1M - $5M',
    focus: 'Visibility & First Enterprise Clients',
  },
  {
    stage: 'Series B',
    arr: '$5M - $15M',
    focus: 'Scaling & Credibility Building',
  },
  {
    stage: 'Series C',
    arr: '$15M - $30M',
    focus: 'Market Leadership & Validation',
  },
  {
    stage: 'Series D',
    arr: '$30M - $50M+',
    focus: 'Enterprise Deals & Industry Recognition',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Zap className="mr-1 h-3 w-3" />
                Replacing Gartner/G2 with AI
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                AI Credibility Scoring for{' '}
                <span className="text-primary">Enterprise-Ready Startups</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Launch products → Collect verified reviews → Build AI credibility score → 
                Get matched with enterprise buyers. The complete journey from startup to enterprise deal.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register/startup">
                    Launch Your Startup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register/enterprise">
                    I'm an Enterprise Buyer
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                <Shield className="inline w-4 h-4 mr-1" />
                AI-powered credibility analysis • Real-time market validation • Enterprise matchmaking
              </p>
            </div>
          </div>
        </section>

        {/* Journey Section - NEW */}
        <section className="border-y bg-primary/5 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">The EthAum Journey</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">
                From Launch to Enterprise Deal
              </h2>
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

        {/* Stats Section */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything You Need to Succeed
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Four powerful modules working together to accelerate your startup growth
              </p>
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
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                <Target className="mr-1 h-3 w-3" />
                Built For You
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                For Series A to D Startups
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Tailored solutions for startups at every growth stage
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {targetAudience.map((item) => (
                <Card key={item.stage} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-primary">{item.stage}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-foreground">
                      {item.arr} ARR
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Award className="mr-1 h-3 w-3" />
                  Why EthAum.ai
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Reduce Marketing Spend by 80-90%
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Stop burning cash on expensive marketing. Our platform drives organic
                  growth through community, credibility, and AI-powered matchmaking.
                </p>
                <ul className="mt-8 space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Launch Your Startup?
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join hundreds of startups already growing with EthAum.ai.
              Get started in minutes, no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/startup">
                  I'm a Startup
                  <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/register/enterprise">
                  I'm an Enterprise Buyer
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}