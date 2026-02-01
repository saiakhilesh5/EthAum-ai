'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  ArrowLeft,
  FileText,
  Download,
  Sparkles,
  Loader2,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  CheckCircle,
  Star,
  BarChart3,
  Eye,
  FileDown,
  Clock,
  Target,
} from 'lucide-react';
import Link from 'next/link';

interface BriefSection {
  id: string;
  name: string;
  description: string;
  icon: any;
  included: boolean;
}

const briefSections: BriefSection[] = [
  { id: 'overview', name: 'Executive Summary', description: 'High-level overview and key highlights', icon: FileText, included: true },
  { id: 'market', name: 'Market Analysis', description: 'Market size, trends, and competitive landscape', icon: TrendingUp, included: true },
  { id: 'team', name: 'Team Profile', description: 'Founders background and team composition', icon: Users, included: true },
  { id: 'financials', name: 'Financial Overview', description: 'Revenue, growth metrics, and projections', icon: DollarSign, included: true },
  { id: 'product', name: 'Product Deep Dive', description: 'Features, technology, and roadmap', icon: Target, included: true },
  { id: 'traction', name: 'Traction & Metrics', description: 'Customer growth, retention, and KPIs', icon: BarChart3, included: true },
  { id: 'reviews', name: 'Customer Reviews', description: 'Sentiment analysis and testimonials', icon: Star, included: false },
  { id: 'risks', name: 'Risk Assessment', description: 'Identified risks and mitigation strategies', icon: Shield, included: false },
];

export default function ExecutiveBriefPage() {
  const [selectedStartup, setSelectedStartup] = useState<string>('');
  const [sections, setSections] = useState(briefSections);
  const [format, setFormat] = useState<'pdf' | 'word' | 'notion'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedBrief, setGeneratedBrief] = useState<any>(null);

  const demoStartups = [
    { id: '1', name: 'CloudSync Pro', category: 'Cloud Infrastructure' },
    { id: '2', name: 'DataFlow AI', category: 'Data Analytics' },
    { id: '3', name: 'SecureVault', category: 'Cybersecurity' },
  ];

  const toggleSection = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, included: !s.included } : s
    ));
  };

  const generateBrief = async () => {
    if (!selectedStartup) {
      toast.error('Please select a startup first');
      return;
    }

    const includedSections = sections.filter(s => s.included);
    if (includedSections.length === 0) {
      toast.error('Please select at least one section');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch('/api/ai/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: selectedStartup,
          sections: includedSections.map(s => s.id),
          format,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setGeneratedBrief(data);
      setGenerationProgress(100);
      toast.success('Executive brief generated successfully!');
    } catch (error) {
      console.error('Brief generation error:', error);
      // Demo brief
      const startup = demoStartups.find(s => s.id === selectedStartup);
      setGeneratedBrief({
        title: `Executive Brief: ${startup?.name}`,
        generatedAt: new Date().toISOString(),
        sections: {
          overview: {
            title: 'Executive Summary',
            content: `${startup?.name} is a rapidly growing ${startup?.category} startup founded in 2021. The company has achieved remarkable traction with 500+ enterprise customers and $2.5M ARR. Key differentiators include proprietary AI technology and exceptional customer satisfaction (NPS 72).`,
            highlights: ['$2.5M ARR', '500+ customers', 'NPS 72', '150% YoY growth'],
          },
          market: {
            title: 'Market Analysis',
            content: 'Operating in a $45B TAM with 23% CAGR. Primary competitors include established players but our unique positioning in the AI-native segment provides significant differentiation. Market timing is favorable with increasing enterprise demand for intelligent automation.',
            size: '$45B TAM',
            growth: '23% CAGR',
          },
          team: {
            title: 'Team Profile',
            content: 'Founded by industry veterans with combined 40+ years of experience. CEO previously led product at a Fortune 500 tech company. CTO holds 12 patents in the space. Team of 35 with strong technical depth.',
            size: 35,
            keyHires: ['Ex-Google Engineering Lead', 'Former McKinsey Partner'],
          },
          financials: {
            title: 'Financial Overview',
            content: 'Strong unit economics with 75% gross margins and 18-month payback period. Runway of 24 months at current burn. On track for profitability by Q4 2025.',
            arr: '$2.5M',
            growth: '150% YoY',
            margin: '75%',
          },
          recommendation: 'STRONG BUY - Well-positioned for growth with solid fundamentals and experienced team.',
        },
      });
      setGenerationProgress(100);
      toast.info('Showing demo brief');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBrief = () => {
    toast.success(`Downloading ${format.toUpperCase()} brief...`);
    // In production, this would trigger actual file download
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="px-2 md:px-3">
                  <ArrowLeft className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-lg md:text-2xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span className="hidden sm:inline">AI Executive Brief Generator</span>
                  <span className="sm:hidden">Executive Brief</span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Generate reports for investors and partners
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1 self-start sm:self-auto">
              <Sparkles className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Configuration */}
          <div className="space-y-4 md:space-y-6">
            {/* Startup Selection */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5" />
                  Select Startup
                </CardTitle>
                <CardDescription className="text-sm">
                  Choose a startup to generate a brief for
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a startup..." />
                  </SelectTrigger>
                  <SelectContent>
                    {demoStartups.map((startup) => (
                      <SelectItem key={startup.id} value={startup.id}>
                        <span className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {startup.name}
                          <Badge variant="outline" className="ml-2">{startup.category}</Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Sections Selection */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5" />
                  Report Sections
                </CardTitle>
                <CardDescription className="text-sm">
                  Customize which sections to include
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.id}
                      className="flex items-start space-x-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={section.id}
                        checked={section.included}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={section.id}
                          className="flex items-center gap-2 cursor-pointer text-sm md:text-base"
                        >
                          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="truncate">{section.name}</span>
                        </Label>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{section.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Format Selection */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileDown className="w-5 h-5" />
                  Output Format
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {[
                    { id: 'pdf', name: 'PDF', desc: 'Print-ready' },
                    { id: 'word', name: 'Word', desc: 'Editable' },
                    { id: 'notion', name: 'Notion', desc: 'Shareable' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id as any)}
                      className={`p-2 md:p-4 rounded-lg border-2 transition-all ${
                        format === f.id
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="text-sm md:text-lg font-semibold">{f.name}</div>
                      <div className="text-xs md:text-sm text-muted-foreground hidden sm:block">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={generateBrief}
              disabled={isGenerating || !selectedStartup}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Brief...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Executive Brief
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={generationProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  {generationProgress < 30 && 'Analyzing startup data...'}
                  {generationProgress >= 30 && generationProgress < 60 && 'Generating insights...'}
                  {generationProgress >= 60 && generationProgress < 90 && 'Compiling report...'}
                  {generationProgress >= 90 && 'Finalizing...'}
                </p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Brief Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedBrief ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                      <h2 className="text-xl font-bold">{generatedBrief.title}</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4" />
                        Generated {new Date(generatedBrief.generatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Sections Preview */}
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {generatedBrief.sections.overview && (
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-primary" />
                            {generatedBrief.sections.overview.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {generatedBrief.sections.overview.content}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {generatedBrief.sections.overview.highlights.map((h: string, i: number) => (
                              <Badge key={i} variant="secondary">{h}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {generatedBrief.sections.financials && (
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            {generatedBrief.sections.financials.title}
                          </h3>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center p-2 bg-muted/50 rounded">
                              <div className="text-lg font-bold text-green-600">
                                {generatedBrief.sections.financials.arr}
                              </div>
                              <div className="text-xs text-muted-foreground">ARR</div>
                            </div>
                            <div className="text-center p-2 bg-muted/50 rounded">
                              <div className="text-lg font-bold text-blue-600">
                                {generatedBrief.sections.financials.growth}
                              </div>
                              <div className="text-xs text-muted-foreground">Growth</div>
                            </div>
                            <div className="text-center p-2 bg-muted/50 rounded">
                              <div className="text-lg font-bold text-purple-600">
                                {generatedBrief.sections.financials.margin}
                              </div>
                              <div className="text-xs text-muted-foreground">Margin</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {generatedBrief.sections.financials.content}
                          </p>
                        </div>
                      )}

                      {generatedBrief.sections.recommendation && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <h3 className="font-semibold flex items-center gap-2 text-green-700">
                            <Star className="w-4 h-4" />
                            AI Recommendation
                          </h3>
                          <p className="text-sm mt-2">{generatedBrief.sections.recommendation}</p>
                        </div>
                      )}
                    </div>

                    {/* Download Button */}
                    <Button className="w-full" onClick={downloadBrief}>
                      <Download className="w-4 h-4 mr-2" />
                      Download {format.toUpperCase()} Brief
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a startup and configure sections to generate a brief</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
