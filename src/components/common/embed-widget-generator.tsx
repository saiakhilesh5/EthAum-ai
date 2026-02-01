'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmbedWidgetGeneratorProps {
  startupId: string;
  startupName: string;
  trustScore: number;
}

export function EmbedWidgetGenerator({ 
  startupId, 
  startupName, 
  trustScore 
}: EmbedWidgetGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showReviews, setShowReviews] = useState(true);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ethaum.ai';

  const widgetUrl = `${baseUrl}/embed/trust-badge/${startupId}?theme=${theme}&size=${size}&reviews=${showReviews}`;

  // HTML embed code
  const htmlCode = `<!-- EthAum.ai Trust Badge -->
<div id="ethaum-trust-badge-${startupId}"></div>
<script src="${baseUrl}/embed/widget.js" 
  data-startup-id="${startupId}"
  data-theme="${theme}"
  data-size="${size}"
  data-show-reviews="${showReviews}"
  async>
</script>`;

  // Markdown badge
  const markdownCode = `[![EthAum Trust Score](${baseUrl}/api/badge/${startupId})](${baseUrl}/startups/${startupId})`;

  // React component code
  const reactCode = `import { TrustBadge } from '@ethaum/react';

<TrustBadge 
  startupId="${startupId}"
  theme="${theme}"
  size="${size}"
  showReviews={${showReviews}}
/>`;

  // iFrame code
  const iframeCode = `<iframe 
  src="${widgetUrl}"
  width="${size === 'sm' ? '200' : size === 'md' ? '300' : '400'}"
  height="${size === 'sm' ? '80' : size === 'md' ? '120' : '160'}"
  frameborder="0"
  title="EthAum Trust Badge - ${startupName}"
  loading="lazy"
></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm font-normal">Beta</Badge>
          Embed Trust Badge
        </CardTitle>
        <CardDescription>
          Add your trust score to your website to build credibility with visitors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <TrustBadgePreview 
              name={startupName}
              score={trustScore}
              theme={theme}
              size={size}
              showReviews={showReviews}
            />
          </div>
        </div>

        {/* Customization Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select value={size} onValueChange={(v) => setSize(v as 'sm' | 'md' | 'lg')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Show Reviews</Label>
            <Select 
              value={showReviews ? 'yes' : 'no'} 
              onValueChange={(v) => setShowReviews(v === 'yes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Code Tabs */}
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="iframe">iFrame</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="space-y-2">
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                <code>{htmlCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(htmlCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="iframe" className="space-y-2">
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                <code>{iframeCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(iframeCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-2">
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                <code>{markdownCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(markdownCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Perfect for GitHub READMEs and documentation sites.
            </p>
          </TabsContent>

          <TabsContent value="react" className="space-y-2">
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                <code>{reactCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(reactCode)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Install: <code className="px-1 py-0.5 bg-muted rounded">npm install @ethaum/react</code>
            </p>
          </TabsContent>
        </Tabs>

        {/* Learn More Link */}
        <div className="pt-4 border-t">
          <a 
            href="/docs/embed-widget" 
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Learn more about widget customization
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// Preview component
function TrustBadgePreview({ 
  name, 
  score, 
  theme, 
  size,
  showReviews 
}: {
  name: string;
  score: number;
  theme: 'light' | 'dark';
  size: 'sm' | 'md' | 'lg';
  showReviews: boolean;
}) {
  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const bgColor = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div 
      className={`inline-flex items-center gap-3 rounded-lg border ${bgColor} ${sizeClasses[size]}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* EthAum Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">E</span>
        </div>
        <div>
          <div className={`font-semibold ${textColor}`}>{name}</div>
          {showReviews && (
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Verified on EthAum.ai
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="text-center pl-3 border-l border-current/10">
        <div className={`font-bold ${scoreColor} ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}`}>
          {score.toFixed(1)}
        </div>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Trust Score
        </div>
      </div>
    </div>
  );
}
