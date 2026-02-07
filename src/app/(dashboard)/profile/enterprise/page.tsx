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
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { STARTUP_STAGES, INDUSTRIES, COMPANY_SIZES, BUDGET_RANGES } from '@src/constants/app';
import { Loader2, X, Building2, Target, DollarSign, Users } from 'lucide-react';

const enterpriseProfileSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  company_size: z.string().min(1, 'Please select company size'),
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contact_person: z.string().min(2, 'Contact person name is required'),
  job_title: z.string().min(2, 'Job title is required'),
  requirements: z.string().min(20, 'Please describe your requirements in detail'),
  budget_range: z.string().min(1, 'Please select a budget range'),
});

type EnterpriseProfileFormData = z.infer<typeof enterpriseProfileSchema>;

export default function EnterpriseProfilePage() {
  const { user, profile, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [preferredStages, setPreferredStages] = useState<string[]>([]);
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnterpriseProfileFormData>({
    resolver: zodResolver(enterpriseProfileSchema),
  });

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('enterprises')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setExistingProfile(data);
          // Populate form with existing data
          setValue('company_name', data.company_name);
          setValue('industry', data.industry);
          setValue('company_size', data.company_size);
          setValue('website_url', data.website_url || '');
          setValue('contact_person', data.contact_person);
          setValue('job_title', data.job_title);
          setValue('requirements', data.requirements);
          setValue('budget_range', data.budget_range);
          setPreferredStages(data.preferred_stages || []);
          setPreferredIndustries(data.preferred_industries || []);
        } else {
          // Pre-fill contact person from profile
          if (profile) {
            setValue('contact_person', profile.full_name);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Pre-fill contact person from profile if no existing profile
        if (profile) {
          setValue('contact_person', profile.full_name);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, profile, setValue]);

  const onSubmit = async (data: EnterpriseProfileFormData) => {
    if (!user) return;

    setIsSaving(true);

    try {
      const profileData = {
        user_id: user.id,
        company_name: data.company_name,
        industry: data.industry,
        company_size: data.company_size,
        website_url: data.website_url || null,
        contact_person: data.contact_person,
        job_title: data.job_title,
        requirements: data.requirements,
        budget_range: data.budget_range,
        preferred_stages: preferredStages,
        preferred_industries: preferredIndustries,
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('enterprises')
          .update(profileData)
          .eq('id', existingProfile.id);

        if (error) throw error;
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        const { error } = await supabase
          .from('enterprises')
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

  const toggleStage = (stage: string) => {
    setPreferredStages((prev) =>
      prev.includes(stage)
        ? prev.filter((s) => s !== stage)
        : [...prev, stage]
    );
  };

  const toggleIndustry = (industry: string) => {
    setPreferredIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
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
          {existingProfile ? 'Edit Company Profile' : 'Create Company Profile'}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {existingProfile
            ? 'Update your company information to get better startup recommendations.'
            : 'Set up your company profile to discover and connect with relevant startups.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Tell us about your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  placeholder="Enterprise Corp."
                  {...register('company_name')}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive">{errors.company_name.message}</p>
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

              <div className="space-y-2">
                <Label htmlFor="company_size">Company Size *</Label>
                <Select
                  value={watch('company_size')}
                  onValueChange={(value) => setValue('company_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company_size && (
                  <p className="text-sm text-destructive">{errors.company_size.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://enterprise.com"
                  {...register('website_url')}
                />
                {errors.website_url && (
                  <p className="text-sm text-destructive">{errors.website_url.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Person */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contact Person
            </CardTitle>
            <CardDescription>
              Primary contact for startup communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Full Name *</Label>
                <Input
                  id="contact_person"
                  placeholder="John Doe"
                  {...register('contact_person')}
                />
                {errors.contact_person && (
                  <p className="text-sm text-destructive">{errors.contact_person.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  placeholder="VP of Innovation"
                  {...register('job_title')}
                />
                {errors.job_title && (
                  <p className="text-sm text-destructive">{errors.job_title.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Requirements
            </CardTitle>
            <CardDescription>
              What are you looking for in a startup partner?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">Describe Your Requirements *</Label>
              <Textarea
                id="requirements"
                placeholder="Describe the type of solutions you're looking for, pain points you want to solve, must-have features, integration requirements, etc."
                rows={5}
                {...register('requirements')}
              />
              {errors.requirements && (
                <p className="text-sm text-destructive">{errors.requirements.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget Range *</Label>
              <Select
                value={watch('budget_range')}
                onValueChange={(value) => setValue('budget_range', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budget_range && (
                <p className="text-sm text-destructive">{errors.budget_range.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Help us match you with the right startups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Preferred Startup Stages</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STARTUP_STAGES.map((stage) => (
                  <div
                    key={stage.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={stage.value}
                      checked={preferredStages.includes(stage.value)}
                      onCheckedChange={() => toggleStage(stage.value)}
                    />
                    <label
                      htmlFor={stage.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {stage.label}
                    </label>
                  </div>
                ))}
              </div>
              {preferredStages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferredStages.map((stage) => {
                    const stageInfo = STARTUP_STAGES.find((s) => s.value === stage);
                    return (
                      <Badge key={stage} variant="secondary">
                        {stageInfo?.label}
                        <button
                          type="button"
                          onClick={() => toggleStage(stage)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Preferred Industries</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-1">
                {INDUSTRIES.slice(0, 12).map((industry) => (
                  <div
                    key={industry}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={preferredIndustries.includes(industry)}
                      onCheckedChange={() => toggleIndustry(industry)}
                    />
                    <label
                      htmlFor={`industry-${industry}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {industry}
                    </label>
                  </div>
                ))}
              </div>
              {preferredIndustries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferredIndustries.map((industry) => (
                    <Badge key={industry} variant="outline">
                      {industry}
                      <button
                        type="button"
                        onClick={() => toggleIndustry(industry)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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