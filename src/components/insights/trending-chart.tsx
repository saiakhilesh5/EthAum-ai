'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Eye, ThumbsUp, Star, MessageSquare } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

interface TrendingChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  type: 'upvotes' | 'views' | 'reviews' | 'comments';
  currentValue: number;
  previousValue: number;
}

export default function TrendingChart({
  title,
  description,
  data,
  type,
  currentValue,
  previousValue,
}: TrendingChartProps) {
  const percentChange = previousValue > 0 
    ? Math.round(((currentValue - previousValue) / previousValue) * 100)
    : 0;
  const isPositive = percentChange >= 0;

  const getIcon = () => {
    switch (type) {
      case 'upvotes':
        return <ThumbsUp className="w-5 h-5 text-primary" />;
      case 'views':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'reviews':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'comments':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
    }
  };

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {isPositive ? '+' : ''}{percentChange}%
          </div>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold">{currentValue.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground mb-1">
            vs {previousValue.toLocaleString()} last period
          </span>
        </div>

        {/* Simple bar chart */}
        <div className="flex items-end gap-1 h-20 mt-4">
          {data.slice(-14).map((point, index) => {
            const height = (point.value / maxValue) * 100;
            return (
              <div
                key={index}
                className="flex-1 group relative"
              >
                <div
                  className="bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {point.date}: {point.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{data[Math.max(0, data.length - 14)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </CardContent>
    </Card>
  );
}
