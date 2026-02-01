'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StarRating from './star-rating';
import { supabase } from '@src/lib/db/supabase';
import { toast } from 'sonner';
import {
  Loader2,
  Sparkles,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const reviewSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  content: z.string().min(50, 'Review must be at least 50 characters'),
  overall_rating: z.number().min(1).max(5),
  ease_of_use_rating: z.number().min(1).max(5),
  value_for_money_rating: z.number().min(1).max(5),
  customer_support_rating: z.number().min(1).max(5),
  features_rating: z.number().min(1).max(5),
  recommend_likelihood: z.number().min(1).max(10),
  use_case: z.string().min(1, 'Please select a use case'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  startupId: string;
  userId: string;
  enterpriseId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const USE_CASES = [
  'Marketing & Sales',
  'Operations & HR',
  'Finance & Accounting',
  'IT & Development',
  'Customer Service',
  'Analytics & BI',
  'Security & Compliance',
  'Other',
];

export default function ReviewForm({
  startupId,
  userId,
  enterpriseId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [sentimentAnalysis, setSentimentAnalysis] = useState<{
    sentiment: string;
    confidence: number;
    suggestions: string[];
  } | null>(null);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: '',
      content: '',
      overall_rating: 0,
      ease_of_use_rating: 0,
      value_for_money_rating: 0,
      customer_support_rating: 0,
      features_rating: 0,
      recommend_likelihood: 5,
      use_case: '',
    },
  });

  const addPro = () => {
    if (newPro.trim() && pros.length < 5) {
      setPros([...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const addCon = () => {
    if (newCon.trim() && cons.length < 5) {
      setCons([...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const analyzeReview = async () => {
    const content = form.getValues('content');
    if (content.length < 50) {
      toast.error('Please write at least 50 characters before analyzing');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, pros, cons }),
      });

      if (!response.ok) throw new Error('Failed to analyze review');

      const analysis = await response.json();
      setSentimentAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing review:', error);
      toast.error('Failed to analyze review');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (values: ReviewFormValues) => {
    if (pros.length === 0 || cons.length === 0) {
      toast.error('Please add at least one pro and one con');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        startup_id: startupId,
        user_id: userId,
        enterprise_id: enterpriseId,
        title: values.title,
        content: values.content,
        overall_rating: values.overall_rating,
        ease_of_use_rating: values.ease_of_use_rating,
        value_for_money_rating: values.value_for_money_rating,
        customer_support_rating: values.customer_support_rating,
        features_rating: values.features_rating,
        recommend_likelihood: values.recommend_likelihood,
        use_case: values.use_case,
        pros,
        cons,
        sentiment_score: sentimentAnalysis?.confidence,
        is_verified: false, // Will be verified by AI later
      });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Ratings Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ratings</CardTitle>
            <CardDescription>Rate your experience with this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="overall_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating *</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      interactive
                      size="lg"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ease_of_use_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ease of Use</FormLabel>
                    <FormControl>
                      <StarRating
                        rating={field.value}
                        interactive
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value_for_money_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value for Money</FormLabel>
                    <FormControl>
                      <StarRating
                        rating={field.value}
                        interactive
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_support_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Support</FormLabel>
                    <FormControl>
                      <StarRating
                        rating={field.value}
                        interactive
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <StarRating
                        rating={field.value}
                        interactive
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recommend_likelihood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How likely are you to recommend? ({field.value}/10)
                  </FormLabel>
                  <FormControl>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    1 = Not at all likely, 10 = Extremely likely
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Review Content */}
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
            <CardDescription>Share your experience with this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Summarize your experience in one line"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your experience in detail. What problem did it solve? How was the implementation?"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/50 characters minimum
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="use_case"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Use Case *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="What did you use this product for?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USE_CASES.map((useCase) => (
                        <SelectItem key={useCase} value={useCase}>
                          {useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Analysis Button */}
            <Button
              type="button"
              variant="outline"
              onClick={analyzeReview}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Analyze with AI
            </Button>

            {/* Sentiment Analysis Result */}
            {sentimentAnalysis && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  {sentimentAnalysis.sentiment === 'positive' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : sentimentAnalysis.sentiment === 'negative' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium capitalize">{sentimentAnalysis.sentiment} Review</span>
                  <span className="text-sm text-muted-foreground">
                    ({Math.round(sentimentAnalysis.confidence * 100)}% confidence)
                  </span>
                </div>
                {sentimentAnalysis.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Suggestions:</p>
                    <ul className="text-sm text-muted-foreground">
                      {sentimentAnalysis.suggestions.map((suggestion, i) => (
                        <li key={i}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pros and Cons */}
        <Card>
          <CardHeader>
            <CardTitle>Pros & Cons</CardTitle>
            <CardDescription>Help others understand the trade-offs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pros */}
            <div>
              <FormLabel className="text-green-600">Pros (What you liked)</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a positive point"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                />
                <Button type="button" onClick={addPro} disabled={pros.length >= 5}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {pros.map((pro, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                  >
                    <CheckCircle className="w-3 h-3" />
                    {pro}
                    <button type="button" onClick={() => removePro(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div>
              <FormLabel className="text-red-600">Cons (What could improve)</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add an area for improvement"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                />
                <Button type="button" onClick={addCon} disabled={cons.length >= 5}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {cons.map((con, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm"
                  >
                    {con}
                    <button type="button" onClick={() => removeCon(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Review
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
