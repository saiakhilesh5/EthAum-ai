'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
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
import { Skeleton } from '@/components/ui/skeleton';
import { STARTUP_STAGES, ARR_RANGES, INDUSTRIES, TEAM_SIZES } from '@src/constants/app';
import { Loader2, X, Plus, Rocket, Building2, Globe, Calendar } from 'lucide-react';

const startupProfileSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters').max(100, 'Tagline must be less than 100 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  demo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  stage: z.string().min(1, 'Please select a stage'),
  arr_range: z.string().min(1, 'Please select an ARR range'),
  industry: z.string().min(1, 'Please select an industry'),
  founded_year: z.number().min(1900).max(new Date().getFullYear()),
  team_size: z.string().min(1, 'Please select team size'),
  headquarters: z.string().min(2, 'Please enter headquarters location'),
});

type StartupProfileFormData = z.infer<typeof startupProfileSchema>;

export default function StartupProfilePage() {
  const { user, profile, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StartupProfileFormData>({
    resolver: zodResolver(startupProfileSchema),
    defaultValues: {
      founded_year: new Date().getFullYear(),
    },
  });

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setExistingProfile(data);
          // Populate form with existing data
          setValue('name', data.name);
          setValue('tagline', data.tagline);
          setValue('description', data.description);
          setValue('website_url', data.website_url || '');
          setValue('demo_url', data.demo_url || '');
          setValue('stage', data.stage);
          setValue('arr_range', data.arr_range);
          setValue('industry', data.industry);
          setValue('founded_year', data.founded_year);
          setValue('team_size', data.team_size);
          setValue('headquarters', data.headquarters);
          setTechnologies(data.technologies || []);
          setFeatures(data.features || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, setValue]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) + '-' + Math.random().toString(36).slice(2, 8);
  };

  const onSubmit = async (data: StartupProfileFormData) => {
    if (!user) return;

    setIsSaving(true);

    try {
      const profileData = {
        user_id: user.id,
        name: data.name,
        slug: existingProfile?.slug || generateSlug(data.name),
        tagline: data.tagline,
        description: data.description,
        website_url: data.website_url || null,
        demo_url: data.demo_url || null,
        stage: data.stage,
        arr_range: data.arr_range,
        industry: data.industry,
        founded_year: data.founded_year,
        team_size: data.team_size,
        headquarters: data.headquarters,
        technologies,
        features,
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('startups')
          .update(profileData)
          .eq('id', existingProfile.id);

        if (error) throw error;
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        const { error } = await supabase
          .from('startups')
          .insert([profileData]);

        if (error) throw error;
        toast.success('Profile created successfully!');
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  if (userLoading || isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Skeleton className="h-8 w-48 sm:w-64" />
        <Skeleton className="h-[400px] sm:h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {existingProfile ? 'Edit Startup Profile' : 'Create Startup Profile'}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {existingProfile
            ? 'Update your startup information to attract more enterprise clients.'
            : 'Set up your startup profile to start launching products and connecting with buyers.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell us about your startup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Acme Inc."
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={watch('industry')}
                  onValueChange={(value) => setValue('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                placeholder="A short, compelling description of what you do"
                {...register('tagline')}
              />
              {errors.tagline && (
                <p className="text-sm text-destructive">{errors.tagline.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your startup, what problem you solve, and your unique value proposition..."
                rows={5}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Company Details
            </CardTitle>
            <CardDescription>
              Funding stage and company metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Funding Stage *</Label>
                <Select
                  value={watch('stage')}
                  onValueChange={(value) => setValue('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STARTUP_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label} ({stage.arrRange})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stage && (
                  <p className="text-sm text-destructive">{errors.stage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="arr_range">ARR Range *</Label>
                <Select
                  value={watch('arr_range')}
                  onValueChange={(value) => setValue('arr_range', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ARR range" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARR_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.arr_range && (
                  <p className="text-sm text-destructive">{errors.arr_range.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="team_size">Team Size *</Label>
                <Select
                  value={watch('team_size')}
                  onValueChange={(value) => setValue('team_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.team_size && (
                  <p className="text-sm text-destructive">{errors.team_size.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="founded_year"
                    type="number"
                    className="pl-10"
                    min={1900}
                    max={new Date().getFullYear()}
                    {...register('founded_year', { valueAsNumber: true })}
                  />
                </div>
                {errors.founded_year && (
                  <p className="text-sm text-destructive">{errors.founded_year.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="headquarters">Headquarters *</Label>
                <Input
                  id="headquarters"
                  placeholder="San Francisco, CA"
                  {...register('headquarters')}
                />
                {errors.headquarters && (
                  <p className="text-sm text-destructive">{errors.headquarters.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Online Presence
            </CardTitle>
            <CardDescription>
              Your website and demo links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://yourcompany.com"
                  {...register('website_url')}
                />
                {errors.website_url && (
                  <p className="text-sm text-destructive">{errors.website_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input
                  id="demo_url"
                  type="url"
                  placeholder="https://demo.yourcompany.com"
                  {...register('demo_url')}
                />
                {errors.demo_url && (
                  <p className="text-sm text-destructive">{errors.demo_url.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
            <CardDescription>
              What technologies does your product use?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, Python, AWS..."
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
              />
              <Button type="button" onClick={addTechnology}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
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

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Highlight the main features of your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Real-time analytics, AI-powered insights..."
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
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <Badge key={feature} variant="outline" className="px-3 py-1">
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

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : existingProfile ? (
              'Update Profile'
            ) : (
              'Create Profile'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}