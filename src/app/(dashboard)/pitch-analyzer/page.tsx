'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  FileUp,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Lightbulb,
  BarChart3,
  RefreshCw,
  Download,
  Share2,
  Loader2,
  FileText,
  Award,
  XCircle,
  ArrowRight,
} from 'lucide-react';

interface AnalysisResult {
  overallScore: number;
  investorReadiness: 'ready' | 'almost' | 'needs-work';
  sections: {
    problemStatement: { score: number; feedback: string; suggestions: string[] };
    solution: { score: number; feedback: string; suggestions: string[] };
    marketSize: { score: number; feedback: string; suggestions: string[] };
    businessModel: { score: number; feedback: string; suggestions: string[] };
    traction: { score: number; feedback: string; suggestions: string[] };
    team: { score: number; feedback: string; suggestions: string[] };
    financials: { score: number; feedback: string; suggestions: string[] };
    askUse: { score: number; feedback: string; suggestions: string[] };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  competitorInsights: string[];
}

export default function PitchAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(uploadedFile);
      setAnalysisResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const analyzePitch = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai/analyze-pitch', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast.success('Pitch deck analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing pitch:', error);
      toast.error('Failed to analyze pitch deck');
      
      // Demo mode - show sample analysis
      setAnalysisResult(generateDemoAnalysis());
      toast.info('Showing demo analysis (API not configured)');
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  const generateDemoAnalysis = (): AnalysisResult => ({
    overallScore: 78,
    investorReadiness: 'almost',
    sections: {
      problemStatement: {
        score: 85,
        feedback: 'Strong problem identification with clear market pain points.',
        suggestions: ['Add specific customer quotes', 'Include quantified impact data'],
      },
      solution: {
        score: 82,
        feedback: 'Innovative solution with clear differentiation.',
        suggestions: ['Show product demo screenshots', 'Highlight unique technology'],
      },
      marketSize: {
        score: 70,
        feedback: 'Good TAM/SAM/SOM breakdown but needs more validation.',
        suggestions: ['Add third-party market research citations', 'Show bottom-up analysis'],
      },
      businessModel: {
        score: 75,
        feedback: 'Clear revenue model with multiple streams.',
        suggestions: ['Add unit economics breakdown', 'Show path to profitability'],
      },
      traction: {
        score: 88,
        feedback: 'Impressive growth metrics and customer logos.',
        suggestions: ['Add month-over-month growth chart', 'Include NPS scores'],
      },
      team: {
        score: 72,
        feedback: 'Experienced team with relevant background.',
        suggestions: ['Add advisor board', 'Highlight previous exits'],
      },
      financials: {
        score: 68,
        feedback: 'Basic projections present but need more detail.',
        suggestions: ['Add detailed assumptions', 'Show multiple scenarios'],
      },
      askUse: {
        score: 80,
        feedback: 'Clear ask with defined use of funds.',
        suggestions: ['Break down milestones by funding tranche', 'Add hiring plan'],
      },
    },
    strengths: [
      'Strong product-market fit demonstrated',
      'Impressive early traction with enterprise clients',
      'Clear competitive moat through AI technology',
      'Experienced founding team in the space',
    ],
    weaknesses: [
      'Financial projections could be more detailed',
      'Limited information on customer acquisition cost',
      'Team section could highlight more domain expertise',
      'Market size needs third-party validation',
    ],
    recommendations: [
      'Add a slide on competitive landscape with positioning',
      'Include customer case study with ROI metrics',
      'Show clear path to Series B with milestones',
      'Add product roadmap for next 18 months',
    ],
    competitorInsights: [
      'Similar startups raised at 15-20x ARR multiples',
      'Top competitors emphasize enterprise security',
      'Market leaders show 3-year financial projections',
      'Successful pitches include demo video links',
    ],
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getReadinessBadge = (readiness: string) => {
    switch (readiness) {
      case 'ready':
        return <Badge className="bg-green-500">Investor Ready</Badge>;
      case 'almost':
        return <Badge className="bg-yellow-500">Almost Ready</Badge>;
      default:
        return <Badge className="bg-red-500">Needs Work</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            AI Pitch Deck Analyzer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Get instant AI feedback on your pitch deck.
          </p>
        </div>
        {analysisResult && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Share2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        )}
      </div>

      {!analysisResult ? (
        /* Upload Section */
        <Card className="border-2 border-dashed">
          <CardContent className="p-12">
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer transition-colors rounded-lg p-8 ${
                isDragActive ? 'bg-primary/10' : 'hover:bg-muted/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                {file ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileUp className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {isDragActive ? 'Drop your pitch deck here' : 'Drag & drop your pitch deck'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (PDF, max 10MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {file && (
              <div className="mt-8 space-y-4">
                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing with AI...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
                <Button
                  onClick={analyzePitch}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Pitch Deck...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Results Section */
        <div className="space-y-4 md:space-y-6">
          {/* Overall Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Overall Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${analysisResult.overallScore * 3.51} 351`}
                        className={getScoreColor(analysisResult.overallScore)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                        {analysisResult.overallScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Investor Readiness</span>
                      {getReadinessBadge(analysisResult.investorReadiness)}
                    </div>
                    <p className="text-muted-foreground">
                      Your pitch deck scores above average. With a few improvements, 
                      you'll be ready for investor meetings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setFile(null);
                    setAnalysisResult(null);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Analyze New Deck
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Find Matching Investors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Section-by-Section Analysis</CardTitle>
              <CardDescription>
                Detailed feedback for each section of your pitch deck
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="problem" className="w-full">
                <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto gap-1">
                  <TabsTrigger value="problem" className="text-xs">Problem</TabsTrigger>
                  <TabsTrigger value="solution" className="text-xs">Solution</TabsTrigger>
                  <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                  <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
                  <TabsTrigger value="traction" className="text-xs">Traction</TabsTrigger>
                  <TabsTrigger value="team" className="text-xs">Team</TabsTrigger>
                  <TabsTrigger value="financials" className="text-xs">Financials</TabsTrigger>
                  <TabsTrigger value="ask" className="text-xs">Ask</TabsTrigger>
                </TabsList>

                {Object.entries(analysisResult.sections).map(([key, section]) => (
                  <TabsContent key={key} value={key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')} className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${getScoreBg(section.score)}/10 flex items-center justify-center`}>
                            <span className={`font-bold ${getScoreColor(section.score)}`}>{section.score}</span>
                          </div>
                          <div>
                            <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-sm text-muted-foreground">{section.feedback}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          Suggestions to Improve
                        </p>
                        <ul className="space-y-2">
                          {section.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="w-4 h-4 mt-0.5 text-primary" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                ))}

                <TabsContent value="problem" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full ${getScoreBg(analysisResult.sections.problemStatement.score)}/10 flex items-center justify-center`}>
                          <span className={`font-bold ${getScoreColor(analysisResult.sections.problemStatement.score)}`}>
                            {analysisResult.sections.problemStatement.score}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">Problem Statement</p>
                          <p className="text-sm text-muted-foreground">{analysisResult.sections.problemStatement.feedback}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Suggestions to Improve
                      </p>
                      <ul className="space-y-2">
                        {analysisResult.sections.problemStatement.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-4 h-4 mt-0.5 text-primary" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 mt-1 text-red-500" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations & Competitor Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Competitor Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.competitorInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 mt-1 text-purple-500" />
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
