'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@src/lib/db/supabase';

interface BadgeData {
  name: string;
  trustScore: number;
  reviewCount: number;
  slug: string;
}

export default function EmbedTrustBadgePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<BadgeData | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = searchParams.get('theme') || 'light';
  const size = searchParams.get('size') || 'md';
  const showReviews = searchParams.get('reviews') !== 'false';

  useEffect(() => {
    async function fetchData() {
      const { data: startup, error } = await supabase
        .from('startups')
        .select('name, slug, trust_score')
        .eq('id', params.id)
        .single();

      if (error || !startup) {
        setLoading(false);
        return;
      }

      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('startup_id', params.id);

      setData({
        name: startup.name,
        trustScore: startup.trust_score || 0,
        reviewCount: count || 0,
        slug: startup.slug,
      });
      setLoading(false);
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-16 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Badge not found
      </div>
    );
  }

  const sizeClasses = {
    sm: 'p-2 text-xs gap-2',
    md: 'p-3 text-sm gap-3',
    lg: 'p-4 text-base gap-4',
  }[size] || 'p-3 text-sm gap-3';

  const logoSize = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }[size] || 'w-8 h-8 text-xs';

  const scoreSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size] || 'text-xl';

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-500';
  
  const scoreColor = data.trustScore >= 80 
    ? 'text-green-500' 
    : data.trustScore >= 60 
      ? 'text-yellow-500' 
      : 'text-red-500';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ethaum.ai';

  return (
    <html>
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; background: transparent; }
        `}</style>
      </head>
      <body>
        <a
          href={`${baseUrl}/startups/${data.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center ${sizeClasses} rounded-lg border ${bgColor} ${borderColor} hover:opacity-90 transition-opacity no-underline`}
          style={{ textDecoration: 'none' }}
        >
          {/* EthAum Logo */}
          <div className={`${logoSize} rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold">E</span>
          </div>

          {/* Info */}
          <div className="flex flex-col min-w-0">
            <span className={`font-semibold ${textColor} truncate`}>
              {data.name}
            </span>
            {showReviews && (
              <span className={`${mutedColor} text-xs`}>
                {data.reviewCount} reviews on EthAum.ai
              </span>
            )}
          </div>

          {/* Score */}
          <div className={`text-center pl-3 border-l ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`font-bold ${scoreColor} ${scoreSize}`}>
              {data.trustScore.toFixed(1)}
            </div>
            <div className={`text-xs ${mutedColor}`}>
              Trust Score
            </div>
          </div>
        </a>
      </body>
    </html>
  );
}
