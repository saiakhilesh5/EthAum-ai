'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@src/components/layout/header';
import { Footer } from '@src/components/layout/footer';
import {
  DEMO_STARTUPS,
  DEMO_LAUNCHES,
  DEMO_REVIEWS,
  DEMO_MATCHES,
  DEMO_AI_INSIGHTS,
  DEMO_CREDIBILITY_SCORE,
} from '@src/lib/demo-data';
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
  ThumbsUp,
  MessageSquare,
  Clock,
  Play,
  Eye,
  Brain,
  Lightbulb,
  Building2,
  Award,
  AlertCircle,
} from 'lucide-react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const currentStartup = DEMO_STARTUPS[0]; // Use CloudScale AI as the demo startup

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Demo Banner */}
        <section className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-2 sm:py-3">
          <div className="container flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="text-sm sm:text-base font-medium">Demo Mode — Explore all features</span>
            </div>
            <Button size="sm" variant="secondary" className="text-xs sm:text-sm" asChild>
              <Link href="/register/startup">Create Account</Link>
            </Button>
          </div>
        </section>

        {/* Demo Header */}
        <section className="py-4 sm:py-6 md:py-8 border-b">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-14 md:h-16 sm:w-14 md:w-16">
                  <AvatarImage src={currentStartup.logo_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg sm:text-xl">
                    {currentStartup.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{currentStartup.name}</h1>
                    {currentStartup.is_verified && (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    )}
                    <Badge variant="secondary" className="text-xs">Demo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{currentStartup.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 pl-14 sm:pl-0">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    <span className="text-2xl sm:text-3xl font-bold text-green-600">
                      {DEMO_CREDIBILITY_SCORE.overall_score}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Credibility Score</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Tabs */}
        <section className="py-4 sm:py-6 md:py-8">
          <div className="container px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:w-auto lg:inline-flex h-auto gap-1">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="launches">Launches</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="matchmaking">Matchmaking</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-4 sm:mt-6 md:mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Credibility Score Panel */}
                  <Card className="lg:col-span-1 border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        AI Credibility Score
                      </CardTitle>
                      <CardDescription>
                        <Brain className="inline w-3 h-3 mr-1" />
                        Generated by EthAum AI based on 47 data points
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-green-600">
                          {DEMO_CREDIBILITY_SCORE.overall_score}
                        </div>
                        <p className="text-muted-foreground">out of 100</p>
                        <Badge className="mt-2 bg-green-500">Enterprise Ready</Badge>
                      </div>

                      <div className="space-y-4">
                        {Object.entries(DEMO_CREDIBILITY_SCORE.breakdown).map(([key, breakdown]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                              <span className="font-medium">{breakdown.score}/100</span>
                            </div>
                            <Progress value={breakdown.score} className="h-2" />
                          </div>
                        ))}
                      </div>

                      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-800 dark:text-blue-200">AI Recommendation</p>
                              <p className="text-sm text-blue-600 dark:text-blue-300">
                                {DEMO_CREDIBILITY_SCORE.ai_recommendation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>

                  {/* Journey Progress */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Your EthAum Journey</CardTitle>
                      <CardDescription>Track your progress from launch to enterprise deal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-row items-center justify-between gap-1 sm:gap-2 md:gap-4 py-2 sm:py-4 overflow-x-auto">
                        <div className="flex flex-col items-center text-center min-w-[60px] sm:min-w-[70px]">
                          <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6" />
                          </div>
                          <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-2 text-green-500" />
                          <p className="font-medium mt-1 text-xs sm:text-sm">Launch</p>
                          <p className="text-[10px] sm:text-xs text-green-600">3</p>
                        </div>
                        <div className="flex-1 h-0.5 sm:h-1 bg-green-500 max-w-[20px] sm:max-w-[40px] md:max-w-[60px]" />
                        <div className="flex flex-col items-center text-center min-w-[60px] sm:min-w-[70px]">
                          <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6" />
                          </div>
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-2 text-yellow-500" />
                          <p className="font-medium mt-1 text-xs sm:text-sm">Reviews</p>
                          <p className="text-[10px] sm:text-xs text-green-600">12</p>
                        </div>
                        <div className="flex-1 h-0.5 sm:h-1 bg-green-500 max-w-[20px] sm:max-w-[40px] md:max-w-[60px]" />
                        <div className="flex flex-col items-center text-center min-w-[60px] sm:min-w-[70px]">
                          <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6" />
                          </div>
                          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-2 text-green-500" />
                          <p className="font-medium mt-1 text-xs sm:text-sm">Credibility</p>
                          <p className="text-[10px] sm:text-xs text-green-600">74</p>
                        </div>
                        <div className="flex-1 h-0.5 sm:h-1 bg-primary max-w-[20px] sm:max-w-[40px] md:max-w-[60px]" />
                        <div className="flex flex-col items-center text-center min-w-[60px] sm:min-w-[70px]">
                          <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                            <Handshake className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6" />
                          </div>
                          <Handshake className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-2 text-purple-500" />
                          <p className="font-medium mt-1 text-xs sm:text-sm">Enterprise</p>
                          <p className="text-[10px] sm:text-xs text-primary font-medium">3!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enterprise Interest Section */}
                <Card className="mt-4 sm:mt-6 border-2 border-purple-500/20">
                  <CardHeader className="pb-2 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-purple-700 text-base sm:text-lg">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        Enterprise Interest
                      </CardTitle>
                      <Badge className="bg-purple-500 text-white animate-pulse w-fit text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Active Buyers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 sm:pt-4 p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {DEMO_MATCHES.map((match) => (
                        <div key={match.id} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-purple-200 text-purple-700 font-bold">
                              {match.enterprise.company_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{match.enterprise.company_name}</p>
                            <p className="text-xs text-muted-foreground">Looking for: {match.enterprise.looking_for?.[0] || 'Technology solutions'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {match.match_score}% Match
                              </Badge>
                              <Badge className="text-xs bg-green-500">
                                {match.ai_insights.estimated_value} deal
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Launches Tab */}
              <TabsContent value="launches" className="mt-4 sm:mt-6 md:mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {DEMO_LAUNCHES.map((launch) => (
                    <Card key={launch.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="text-3xl sm:text-4xl">🚀</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-sm sm:text-base truncate">{launch.title}</h3>
                              {launch.is_featured && (
                                <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{launch.tagline}</p>
                            <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
                              <span className="flex items-center gap-1 text-primary font-semibold">
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                {launch.upvote_count}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                {launch.comment_count}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                {launch.view_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-4 sm:mt-6 md:mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {DEMO_REVIEWS.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {review.reviewer.full_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{review.reviewer.full_name}</p>
                                {review.is_verified && (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{review.reviewer.role} at {review.reviewer.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.overall_rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-muted-foreground">{review.content}</p>
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              AI Verified • {review.helpful_count} found helpful
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="mt-4 sm:mt-6 md:mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Market Position */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                        Market Position Analysis
                      </CardTitle>
                      <CardDescription>
                        <Brain className="inline w-3 h-3 mr-1" />
                        AI-generated based on competitive analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Quadrant: {DEMO_AI_INSIGHTS.market_position.quadrant}</p>
                        <p className="text-muted-foreground">{DEMO_AI_INSIGHTS.market_position.analysis}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Market Readiness</p>
                          <p className="text-2xl font-bold text-green-600">
                            {DEMO_AI_INSIGHTS.market_position.market_readiness}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Growth Potential</p>
                          <p className="text-2xl font-bold text-primary">
                            {DEMO_AI_INSIGHTS.market_position.growth_potential}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deal Predictor */}
                  <Card className="border-2 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        AI Deal Predictor
                      </CardTitle>
                      <CardDescription>
                        <Brain className="inline w-3 h-3 mr-1" />
                        Machine learning prediction based on 1,000+ deals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-purple-600">
                          {DEMO_AI_INSIGHTS.deal_predictor.probability}%
                        </div>
                        <p className="text-muted-foreground">Deal probability in next 90 days</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            ${(DEMO_AI_INSIGHTS.deal_predictor.estimated_value / 1000).toFixed(0)}K
                          </p>
                          <p className="text-sm text-muted-foreground">Estimated Value</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold">
                            {DEMO_AI_INSIGHTS.deal_predictor.time_to_close}
                          </p>
                          <p className="text-sm text-muted-foreground">Est. Time to Close</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {DEMO_AI_INSIGHTS.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {rec.priority === 'high' && <AlertCircle className="w-4 h-4" />}
                              {rec.priority === 'medium' && <Clock className="w-4 h-4" />}
                              {rec.priority === 'low' && <Lightbulb className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{rec.action}</p>
                              <p className="text-sm text-muted-foreground mt-1">{rec.impact}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {rec.priority} priority
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Matchmaking Tab */}
              <TabsContent value="matchmaking" className="mt-8">
                <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Brain className="w-8 h-8 text-purple-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300">
                          AI Matchmaking Engine
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Our AI analyzes your product capabilities, target market, and enterprise needs to find 
                          the most compatible buyers. Match scores are calculated using 23 factors including 
                          industry fit, technology alignment, and deal propensity.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {DEMO_MATCHES.map((match) => (
                    <Card key={match.id} className="hover:shadow-lg transition-all border-2 border-purple-500/10">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                              <AvatarFallback className="bg-purple-200 text-purple-700 font-bold text-sm sm:text-base">
                                {match.enterprise.company_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <CardTitle className="text-base sm:text-lg truncate">{match.enterprise.company_name}</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">{match.enterprise.industry}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Looking for:</p>
                          <p className="text-sm sm:text-base font-medium">{match.enterprise.looking_for?.[0] || 'Technology solutions'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Match Score</p>
                            <p className="text-xl sm:text-2xl font-bold text-purple-600">{match.match_score}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Est. Deal Value</p>
                            <p className="text-2xl font-bold text-green-600">
                              {match.ai_insights.estimated_value}
                            </p>
                          </div>
                        </div>
                        <Progress value={match.match_score} className="h-2" />
                        <Badge className={`w-full justify-center ${
                          match.status === 'interested' ? 'bg-green-500' :
                          match.status === 'connected' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}>
                          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Ready to Get Your Own Dashboard?</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg opacity-90 max-w-2xl mx-auto">
              Create your account now and start building credibility with enterprise buyers.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/register/startup">
                  Create Startup Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
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
