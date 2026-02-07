'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { supabase } from '@src/lib/db/supabase';
import { useUser } from '@src/hooks/use-user';
import { UpvoteButton, CommentSection } from '@src/components/launches';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Eye,
  MessageSquare,
  Share2,
  Award,
  Rocket,
  Target,
  Gift,
  CheckCircle2,
} from 'lucide-react';

export default function LaunchDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const [launch, setLaunch] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userUpvoted, setUserUpvoted] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchLaunch();
      incrementViewCount();
    }
  }, [params.id]);

  useEffect(() => {
    if (user && launch) {
      checkUserUpvote();
    }
  }, [user, launch]);

  const fetchLaunch = async () => {
    try {
      const { data, error } = await supabase
        .from('launches')
        .select(`
          *,
          startup:startups(
            id,
            name,
            slug,
            logo_url,
            tagline,
            industry,
            stage,
            arr_range,
            website_url,
            credibility_score,
            is_verified
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setLaunch(data);
    } catch (error) {
      console.error('Error fetching launch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementViewCount = async () => {
    await supabase.rpc('increment_view_count', { launch_id: params.id });
  };

  const checkUserUpvote = async () => {
    const { data } = await supabase
      .from('upvotes')
      .select('id')
      .eq('launch_id', launch.id)
      .eq('user_id', user?.id)
      .single();

    setUserUpvoted(!!data);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: launch.title,
        text: launch.tagline,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatStage = (stage: string) => {
    return stage.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 sm:h-64 w-full" />
        <Skeleton className="h-36 sm:h-48 w-full" />
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Launch not found</h2>
        <Link href="/launches">
          <Button>Back to Launches</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/launches"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Launches
      </Link>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Launch Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex gap-3 sm:gap-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted">
              {launch.thumbnail_url ? (
                <img
                  src={launch.thumbnail_url}
                  alt={launch.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                    <AvatarImage src={launch.startup.logo_url || ''} />
                    <AvatarFallback>
                      {launch.startup.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold">{launch.title}</h1>
                    {launch.is_featured && (
                      <Badge className="bg-yellow-500 text-white text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 line-clamp-2">
                    {launch.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              {format(new Date(launch.launch_date), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              {launch.view_count} views
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              {launch.comment_count} comments
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <UpvoteButton
              launchId={launch.id}
              initialCount={launch.upvote_count}
              initialUpvoted={userUpvoted}
              size="lg"
            />
            {launch.startup.website_url && (
              <a
                href={launch.startup.website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="sm:size-lg">
                  <ExternalLink className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Visit Website</span>
                </Button>
              </a>
            )}
            <Button variant="ghost" size="sm" className="sm:size-lg" onClick={handleShare}>
              <Share2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">About this Launch</h2>
            <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">
              {launch.description}
            </p>
          </div>

          {/* Key Features */}
          {launch.key_features && launch.key_features.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                Key Features
              </h2>
              <ul className="space-y-2">
                {launch.key_features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Target Audience */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              Target Audience
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">{launch.target_audience}</p>
          </div>

          {/* Special Offer */}
          {launch.special_offer && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Gift className="h-5 w-5" />
                  Special Launch Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-800 dark:text-green-300">
                  {launch.special_offer}
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Comments Section */}
          <CommentSection launchId={launch.id} />
        </div>

        {/* Right Column - Startup Info */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
                About the Startup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <Link href={`/startups/${launch.startup.slug}`}>
                <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg transition-colors">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={launch.startup.logo_url || ''} />
                    <AvatarFallback>
                      {launch.startup.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{launch.startup.name}</h3>
                      {launch.startup.is_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {launch.startup.tagline}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{launch.startup.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stage</span>
                  <Badge variant="outline">{formatStage(launch.startup.stage)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ARR</span>
                  <span className="font-medium">{launch.startup.arr_range}</span>
                </div>
                {launch.startup.credibility_score > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credibility Score</span>
                    <span className="font-medium text-green-600">
                      {launch.startup.credibility_score}/100
                    </span>
                  </div>
                )}
              </div>

              <Link href={`/startups/${launch.startup.slug}`}>
                <Button variant="outline" className="w-full">
                  View Full Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Embeddable Badge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Embed Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Share your launch on your website
              </p>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono break-all">
                {`<a href="${typeof window !== 'undefined' ? window.location.href : ''}" target="_blank"><img src="${process.env.NEXT_PUBLIC_APP_URL}/api/badge/${launch.id}" alt="Launched on EthAum.ai" /></a>`}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<a href="${window.location.href}" target="_blank"><img src="${process.env.NEXT_PUBLIC_APP_URL}/api/badge/${launch.id}" alt="Launched on EthAum.ai" /></a>`
                  );
                  toast.success('Badge code copied!');
                }}
              >
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
