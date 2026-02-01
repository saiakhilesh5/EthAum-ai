'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dna,
  TrendingUp,
  Target,
  Users,
  Zap,
  Shield,
  Globe,
  Award,
  BarChart3,
  RefreshCw,
  Share2,
  Download,
} from 'lucide-react';

interface DNAData {
  innovation: number;
  marketFit: number;
  teamStrength: number;
  scalability: number;
  traction: number;
  funding: number;
  competitive: number;
  technology: number;
}

interface StartupDNAProps {
  startupId?: string;
  startupName?: string;
  data?: DNAData;
}

export default function StartupDNA({ startupId, startupName = 'Your Startup', data }: StartupDNAProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Default DNA data (demo)
  const dnaData: DNAData = data || {
    innovation: 85,
    marketFit: 78,
    teamStrength: 92,
    scalability: 70,
    traction: 88,
    funding: 65,
    competitive: 75,
    technology: 90,
  };

  const segments = [
    { key: 'innovation', label: 'Innovation', color: '#8B5CF6', icon: Zap, description: 'Product uniqueness and novelty' },
    { key: 'marketFit', label: 'Market Fit', color: '#10B981', icon: Target, description: 'Product-market alignment' },
    { key: 'teamStrength', label: 'Team', color: '#F59E0B', icon: Users, description: 'Team experience and expertise' },
    { key: 'scalability', label: 'Scalability', color: '#3B82F6', icon: TrendingUp, description: 'Growth potential' },
    { key: 'traction', label: 'Traction', color: '#EF4444', icon: BarChart3, description: 'Current momentum and metrics' },
    { key: 'funding', label: 'Funding', color: '#EC4899', icon: Award, description: 'Financial runway and efficiency' },
    { key: 'competitive', label: 'Competitive', color: '#06B6D4', icon: Shield, description: 'Market positioning and moat' },
    { key: 'technology', label: 'Technology', color: '#84CC16', icon: Globe, description: 'Tech stack and innovation' },
  ];

  // Animation effect
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  // Draw radar chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const numSegments = segments.length;
    const angleStep = (2 * Math.PI) / numSegments;
    const startAngle = -Math.PI / 2;

    // Draw background circles
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < numSegments; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.strokeStyle = '#e5e7eb';
      ctx.stroke();

      // Draw labels
      const labelRadius = radius + 30;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);
      
      ctx.fillStyle = hoveredSegment === segments[i].key ? segments[i].color : '#6b7280';
      ctx.font = hoveredSegment === segments[i].key ? 'bold 12px Inter' : '12px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(segments[i].label, labelX, labelY);
    }

    // Draw data polygon with animation
    ctx.beginPath();
    for (let i = 0; i < numSegments; i++) {
      const angle = startAngle + i * angleStep;
      const value = dnaData[segments[i].key as keyof DNAData] * animationProgress;
      const pointRadius = (value / 100) * radius;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < numSegments; i++) {
      const angle = startAngle + i * angleStep;
      const value = dnaData[segments[i].key as keyof DNAData] * animationProgress;
      const pointRadius = (value / 100) * radius;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, hoveredSegment === segments[i].key ? 8 : 5, 0, 2 * Math.PI);
      ctx.fillStyle = segments[i].color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [dnaData, hoveredSegment, animationProgress]);

  const overallScore = Math.round(
    Object.values(dnaData).reduce((a, b) => a + b, 0) / Object.values(dnaData).length
  );

  const getScoreLabel = (score: number) => {
    if (score >= 85) return { label: 'Exceptional', color: 'bg-green-500' };
    if (score >= 70) return { label: 'Strong', color: 'bg-blue-500' };
    if (score >= 55) return { label: 'Developing', color: 'bg-yellow-500' };
    return { label: 'Emerging', color: 'bg-orange-500' };
  };

  const scoreInfo = getScoreLabel(overallScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dna className="w-6 h-6 text-primary" />
            Startup DNA Analysis
          </h2>
          <p className="text-muted-foreground">
            Visual breakdown of {startupName}'s core characteristics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>DNA Visualization</CardTitle>
                <CardDescription>Hover over points to see details</CardDescription>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{overallScore}</div>
                <Badge className={scoreInfo.color}>{scoreInfo.label}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="max-w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Segment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trait Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {segments.map((segment) => {
              const value = dnaData[segment.key as keyof DNAData];
              const Icon = segment.icon;
              return (
                <div
                  key={segment.key}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    hoveredSegment === segment.key ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onMouseEnter={() => setHoveredSegment(segment.key)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: segment.color }} />
                      <span className="font-medium text-sm">{segment.label}</span>
                    </div>
                    <span className="font-bold" style={{ color: segment.color }}>
                      {value}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${value * animationProgress}%`,
                        backgroundColor: segment.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{segment.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="font-semibold text-green-600 mb-2">Top Strengths</h4>
              <ul className="text-sm space-y-1">
                {Object.entries(dnaData)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([key]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      {segments.find(s => s.key === key)?.label}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-600 mb-2">Growth Areas</h4>
              <ul className="text-sm space-y-1">
                {Object.entries(dnaData)
                  .sort(([, a], [, b]) => a - b)
                  .slice(0, 3)
                  .map(([key]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      {segments.find(s => s.key === key)?.label}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Recommendation</h4>
              <p className="text-sm">
                Focus on improving{' '}
                <strong>
                  {segments.find(
                    s => s.key === Object.entries(dnaData).sort(([, a], [, b]) => a - b)[0][0]
                  )?.label}
                </strong>{' '}
                to unlock your next growth phase.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
