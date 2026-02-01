'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { INDUSTRIES, STARTUP_STAGES } from '@src/constants/app';
import { X, Sparkles } from 'lucide-react';

interface MatchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  userType: 'startup' | 'enterprise';
}

export interface FilterState {
  status: string;
  minScore: number;
  industry: string;
  stage: string;
  arrRange: string;
}

const ARR_RANGES = [
  { value: 'all', label: 'All ARR' },
  { value: '$1M-$5M', label: '$1M-$5M' },
  { value: '$5M-$10M', label: '$5M-$10M' },
  { value: '$10M-$25M', label: '$10M-$25M' },
  { value: '$25M-$50M', label: '$25M-$50M' },
  { value: '$50M+', label: '$50M+' },
];

export default function MatchFilters({
  onFiltersChange,
  userType,
}: MatchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    minScore: 50,
    industry: 'all',
    stage: 'all',
    arrRange: 'all',
  });

  const updateFilter = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      status: 'all',
      minScore: 50,
      industry: 'all',
      stage: 'all',
      arrRange: 'all',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== 'all' && v !== 50
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Match Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={filters.status}
            onValueChange={(v) => updateFilter('status', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Score Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Minimum Match Score: {filters.minScore}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={filters.minScore}
            onChange={(e) => updateFilter('minScore', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Industry Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Industry</label>
          <Select
            value={filters.industry}
            onValueChange={(v) => updateFilter('industry', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stage Filter (for enterprise users viewing startups) */}
        {userType === 'enterprise' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Startup Stage</label>
            <Select
              value={filters.stage}
              onValueChange={(v) => updateFilter('stage', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STARTUP_STAGES.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ARR Range Filter (for enterprise users viewing startups) */}
        {userType === 'enterprise' && (
          <div>
            <label className="text-sm font-medium mb-2 block">ARR Range</label>
            <Select
              value={filters.arrRange}
              onValueChange={(v) => updateFilter('arrRange', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ARR_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active Filters Preview */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
            <div className="flex flex-wrap gap-1">
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.status}
                </Badge>
              )}
              {filters.minScore !== 50 && (
                <Badge variant="secondary" className="text-xs">
                  Min: {filters.minScore}%
                </Badge>
              )}
              {filters.industry !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.industry}
                </Badge>
              )}
              {filters.stage !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.stage}
                </Badge>
              )}
              {filters.arrRange !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {filters.arrRange}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
