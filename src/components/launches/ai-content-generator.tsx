'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AIContentGeneratorProps {
  startupName: string;
  industry: string;
  description: string;
  onSelectTagline: (tagline: string) => void;
  onSelectDescription: (description: string) => void;
}

export function AIContentGenerator({
  startupName,
  industry,
  description,
  onSelectTagline,
  onSelectDescription,
}: AIContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    taglines: string[];
    launchDescription: string;
    keyFeatures: string[];
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateContent = async () => {
    if (!startupName || !description) {
      toast.error('Please fill in startup name and description first');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-launch-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName,
          industry,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Let AI help you create compelling launch content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedContent ? (
          <Button
            type="button"
            onClick={generateContent}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Launch Content
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Taglines */}
            <div>
              <h4 className="font-medium mb-2">Suggested Taglines</h4>
              <div className="space-y-2">
                {generatedContent.taglines.map((tagline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <p className="text-sm flex-1">{tagline}</p>
                    <div className="flex gap-1 ml-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(tagline, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectTagline(tagline)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Launch Description</h4>
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm whitespace-pre-wrap">
                  {generatedContent.launchDescription}
                </p>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(generatedContent.launchDescription, -1)
                    }
                  >
                    {copiedIndex === -1 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onSelectDescription(generatedContent.launchDescription)
                    }
                  >
                    Use Description
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="font-medium mb-2">Suggested Key Features</h4>
              <ul className="space-y-1">
                {generatedContent.keyFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm p-2 bg-background rounded border"
                  >
                    <span className="text-primary">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Regenerate Button */}
            <Button
              type="button"
              variant="outline"
              onClick={generateContent}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate Content
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
