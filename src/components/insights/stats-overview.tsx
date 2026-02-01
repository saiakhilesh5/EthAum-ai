'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color?: string;
}

interface StatsOverviewProps {
  stats: Stat[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={cn('p-2 rounded-lg bg-muted', stat.color)}>
                {stat.icon}
              </div>
              {stat.change !== undefined && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  stat.change > 0 ? 'text-green-500' : 
                  stat.change < 0 ? 'text-red-500' : 'text-muted-foreground'
                )}>
                  {stat.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stat.change < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {stat.changeLabel && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.changeLabel}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
