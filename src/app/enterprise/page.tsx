'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@src/components/layout/header';
import { Footer } from '@src/components/layout/footer';
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign,
  Brain,
  Search,
  BarChart3,
  Handshake,
  Play,
  Calculator,
  Lightbulb,
} from 'lucide-react';

export default function EnterprisePage() {
  // ROI Calculator state
  const [vendorCount, setVendorCount] = useState(50);
  const [avgVendorTime, setAvgVendorTime] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [avgDealSize, setAvgDealSize] = useState(100000);

  // Calculate ROI
  const currentCostPerVendor = avgVendorTime * hourlyRate;
  const totalCurrentCost = currentCostPerVendor * vendorCount;
  const ethaumCostPerVendor = avgVendorTime * 0.3 * hourlyRate; // 70% time savings
  const totalEthaumCost = ethaumCostPerVendor * vendorCount;
  const costSavings = totalCurrentCost - totalEthaumCost;
  const timeSaved = (vendorCount * avgVendorTime * 0.7); // hours
  const betterVendorValue = vendorCount * 0.15 * avgDealSize * 0.1; // 15% more matches, 10% better deals
  const totalROI = costSavings + betterVendorValue;

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Vendor Discovery',
      description: 'Find pre-vetted startups matching your exact requirements. No more cold outreach or bad RFP responses.',
    },
    {
      icon: Shield,
      title: 'Credibility Scores',
      description: 'Every startup comes with an AI-computed credibility score based on reviews, traction, and market validation.',
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Access emerging vendor quadrants and real-time market positioning without paying for expensive analyst reports.',
    },
    {
      icon: Clock,
      title: '70% Faster Evaluation',
      description: 'Pre-qualified startups mean less time on due diligence and faster time to pilot.',
    },
    {
      icon: Search,
      title: 'Smart Matching',
      description: 'Our AI matches your technical requirements, industry, and budget with the most compatible vendors.',
    },
    {
      icon: Handshake,
      title: 'Direct Connections',
      description: 'Skip the middlemen. Connect directly with startup founders for POCs and pilots.',
    },
  ];

  const stats = [
    { value: '70%', label: 'Time Saved on Vendor Evaluation' },
    { value: '500+', label: 'Pre-Vetted Startups' },
    { value: '92%', label: 'Match Accuracy Rate' },
    { value: '2 Days', label: 'Avg. Time to First Match' },
  ];

  const testimonials = [
    {
      quote: 'We used to spend weeks evaluating vendors. EthAum gave us qualified matches in 48 hours.',
      name: 'Michael Chen',
      role: 'VP of Innovation, Fortune 500 Tech',
      metric: '70% time saved',
    },
    {
      quote: 'The credibility scores eliminated the guesswork. We knew exactly which startups were enterprise-ready.',
      name: 'Sarah Williams',
      role: 'Director of Procurement, Global Bank',
      metric: '$2.3M in better deals',
    },
    {
      quote: 'Finally, an alternative to expensive analyst reports. EthAum\'s market intelligence is invaluable.',
      name: 'James Thompson',
      role: 'CTO, Healthcare Enterprise',
      metric: '45 vendors evaluated',
    },
  ];

  const useCases = [
    {
      title: 'Technology Procurement',
      description: 'Find the right SaaS, AI, or infrastructure vendors for your tech stack.',
      icon: '💻',
    },
    {
      title: 'Innovation Scouting',
      description: 'Discover emerging startups for your corporate innovation programs.',
      icon: '🔬',
    },
    {
      title: 'Vendor Consolidation',
      description: 'Evaluate existing vendors against new alternatives with objective scoring.',
      icon: '📊',
    },
    {
      title: 'M&A Due Diligence',
      description: 'Assess startup credibility and market position for investment decisions.',
      icon: '🤝',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Building2 className="mr-1 h-3 w-3" />
                  For Enterprise Buyers
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Find Enterprise-Ready Vendors{' '}
                  <span className="text-primary">70% Faster</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                  Stop wasting time on vendor evaluation. Our AI finds pre-vetted, credibility-scored 
                  startups matching your exact requirements — without the expensive analyst fees.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register/enterprise">
                      Start Finding Vendors
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/demo">
                      <Play className="mr-2 h-4 w-4" />
                      See Demo
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Free to get started</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <div className="text-center space-y-4">
                    <Brain className="w-16 h-16 mx-auto text-purple-500" />
                    <h3 className="text-xl font-semibold">AI-Powered Matching</h3>
                    <p className="text-muted-foreground">
                      Tell us what you need. Our AI analyzes 500+ startups and delivers 
                      your top matches in under 48 hours.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-white dark:bg-background rounded-lg">
                        <p className="text-2xl font-bold text-primary">23</p>
                        <p className="text-xs text-muted-foreground">Matching factors</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-background rounded-lg">
                        <p className="text-2xl font-bold text-green-600">92%</p>
                        <p className="text-xs text-muted-foreground">Match accuracy</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/10 dark:to-blue-950/10">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Calculator className="mr-1 h-3 w-3" />
                ROI Calculator
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">
                Calculate Your Savings
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                See how much time and money you can save by using EthAum.ai for vendor evaluation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Current Process</CardTitle>
                  <CardDescription>Enter your vendor evaluation metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="vendorCount">Vendors evaluated per year</Label>
                    <Input
                      id="vendorCount"
                      type="number"
                      value={vendorCount}
                      onChange={(e) => setVendorCount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avgTime">Average hours per vendor evaluation</Label>
                    <Input
                      id="avgTime"
                      type="number"
                      value={avgVendorTime}
                      onChange={(e) => setAvgVendorTime(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Team hourly rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealSize">Average vendor deal size ($)</Label>
                    <Input
                      id="dealSize"
                      type="number"
                      value={avgDealSize}
                      onChange={(e) => setAvgDealSize(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Your Annual ROI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-green-600">
                      ${totalROI.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground">Total Annual Value</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-background rounded-lg text-center">
                      <Clock className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold">{Math.round(timeSaved)}h</p>
                      <p className="text-xs text-muted-foreground">Hours Saved</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-background rounded-lg text-center">
                      <DollarSign className="w-6 h-6 mx-auto text-green-500 mb-2" />
                      <p className="text-2xl font-bold">${costSavings.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Cost Savings</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">Better Vendor Selection</p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          AI matching leads to 15% more successful vendor partnerships, 
                          adding ${Math.round(betterVendorValue).toLocaleString()} in value.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/register/enterprise">
                      Start Saving Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">
                Built for Enterprise Procurement
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <feature.icon className="w-10 h-10 text-primary mb-4" />
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

        {/* Use Cases */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                <Target className="mr-1 h-3 w-3" />
                Use Cases
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">
                How Enterprises Use EthAum.ai
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">
                Trusted by Enterprise Buyers
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">{testimonial.metric}</Badge>
                  </div>
                  <CardHeader>
                    <CardDescription className="text-lg italic">
                      &quot;{testimonial.quote}&quot;
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Transform Your Vendor Evaluation?
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join leading enterprises already finding better vendors faster with EthAum.ai.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/enterprise">
                  Create Enterprise Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/demo">Try Demo First</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
