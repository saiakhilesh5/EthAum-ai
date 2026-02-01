'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { supabase } from '@src/lib/db/supabase';
import { useUser } from '@src/hooks/use-user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AIContentGenerator } from './ai-content-generator';
import {
  Loader2,
  X,
  Plus,
  Rocket,
  Image as ImageIcon,
  Calendar,
  Target,
  Gift,
  Sparkles,
} from 'lucide-react';

const launchSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(60, 'Title must be less than 60 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters').max(100, 'Tagline must be less than 100 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  target_audience: z.string().min(10, 'Please describe your target audience'),
  special_offer: z.string().optional(),
  launch_date: z.string().min(1, 'Please select a launch date'),
  status: z.enum(['draft', 'scheduled', 'live']),
});

type LaunchFormData = z.infer<typeof launchSchema>;

interface LaunchFormProps {
  existingLaunch?: any;
  startup: any;
}

export function LaunchForm({ existingLaunch, startup }: LaunchFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState<string[]>(existingLaunch?.key_features || []);
  const [newFeature, setNewFeature] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(existingLaunch?.thumbnail_url || '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LaunchFormData>({
    resolver: zodResolver(launchSchema),
    defaultValues: {
      title: existingLaunch?.title || '',
      tagline: existingLaunch?.tagline || '',
      description: existingLaunch?.description || '',
      target_audience: existingLaunch?.target_audience || '',
      special_offer: existingLaunch?.special_offer || '',
      launch_date: existingLaunch?.launch_date
        ? format(new Date(existingLaunch.launch_date), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      status: existingLaunch?.status || 'draft',
    },
  });

  const onSubmit = async (data: LaunchFormData) => {
    if (!startup) {
      toast.error('No startup profile found. Please create one first.');
      return;
    }

    setIsSaving(true);

    try {
      const launchData = {
        startup_id: startup.id,
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        thumbnail_url: thumbnailUrl || null,
        key_features: keyFeatures,
        target_audience: data.target_audience,
        special_offer: data.special_offer || null,
        launch_date: new Date(data.launch_date).toISOString(),
        status: data.status,
      };

      if (existingLaunch) {
        const { error } = await supabase
          .from('launches')
          .update(launchData)
          .eq('id', existingLaunch.id);

        if (error) throw error;
        toast.success('Launch updated successfully!');
      } else {
        const { error } = await supabase
          .from('launches')
          .insert([launchData]);

        if (error) throw error;
        toast.success('Launch created successfully!');
      }

      router.push('/launches');
    } catch (error: any) {
      console.error('Error saving launch:', error);
      toast.error(error.message || 'Failed to save launch');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !keyFeatures.includes(newFeature.trim())) {
      setKeyFeatures([...keyFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setKeyFeatures(keyFeatures.filter((f) => f !== feature));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* AI Content Generator */}
      <AIContentGenerator
        startupName={startup?.name || ''}
        industry={startup?.industry || ''}
        description={startup?.description || ''}
        onSelectTagline={(tagline) => setValue('tagline', tagline)}
        onSelectDescription={(desc) => setValue('description', desc)}
      />

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Launch Details
          </CardTitle>
          <CardDescription>
            Create a compelling launch to attract upvotes and feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Launch Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Introducing AI-Powered Analytics for Startups"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline *</Label>
            <Input
              id="tagline"
              placeholder="A short, catchy description (max 100 characters)"
              {...register('tagline')}
            />
            {errors.tagline && (
              <p className="text-sm text-destructive">{errors.tagline.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you're launching, its features, and why people should care..."
              rows={8}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">
              <ImageIcon className="h-4 w-4 inline mr-2" />
              Thumbnail URL
            </Label>
            <Input
              id="thumbnail_url"
              type="url"
              placeholder="https://example.com/thumbnail.png"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Recommended size: 1200x630px (Open Graph standard)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Key Features
          </CardTitle>
          <CardDescription>
            Highlight the main features of your launch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Real-time collaboration, AI insights..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button type="button" onClick={addFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {keyFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keyFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="px-3 py-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Audience & Offer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Targeting & Offers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience *</Label>
            <Textarea
              id="target_audience"
              placeholder="Who is this launch for? e.g., Series A-D SaaS startups looking to reduce CAC..."
              rows={3}
              {...register('target_audience')}
            />
            {errors.target_audience && (
              <p className="text-sm text-destructive">{errors.target_audience.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_offer">
              <Gift className="h-4 w-4 inline mr-2" />
              Special Launch Offer (Optional)
            </Label>
            <Input
              id="special_offer"
              placeholder="e.g., 50% off for first 100 users, Free trial for 30 days..."
              {...register('special_offer')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Launch Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Launch Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="launch_date">Launch Date & Time *</Label>
              <Input
                id="launch_date"
                type="datetime-local"
                {...register('launch_date')}
              />
              {errors.launch_date && (
                <p className="text-sm text-destructive">{errors.launch_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: any) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setValue('status', 'draft');
            handleSubmit(onSubmit)();
          }}
          disabled={isSaving}
        >
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : existingLaunch ? (
            'Update Launch'
          ) : (
            'Create Launch'
          )}
        </Button>
      </div>
    </form>
  );
}
