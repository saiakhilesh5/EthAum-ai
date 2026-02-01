'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@src/hooks/use-user';
import { supabase } from '@src/lib/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Mail,
  Smartphone,
  Globe,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [notifications, setNotifications] = useState({
    emailNewMatch: true,
    emailNewReview: true,
    emailWeeklyDigest: true,
    pushUpvotes: true,
    pushComments: true,
    pushMatches: true,
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setUserData(data);
      setFullName(data.full_name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send password reset email');
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 md:h-96" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 md:w-6 md:h-6" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 md:space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="text-xs md:text-sm"><User className="w-3 h-3 md:w-4 md:h-4 md:mr-2" /><span className="hidden md:inline">Profile</span></TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs md:text-sm"><Bell className="w-3 h-3 md:w-4 md:h-4 md:mr-2" /><span className="hidden md:inline">Notifications</span></TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm"><Shield className="w-3 h-3 md:w-4 md:h-4 md:mr-2" /><span className="hidden md:inline">Security</span></TabsTrigger>
          <TabsTrigger value="billing" className="text-xs md:text-sm"><CreditCard className="w-3 h-3 md:w-4 md:h-4 md:mr-2" /><span className="hidden md:inline">Billing</span></TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription className="text-sm">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-16 w-16 md:h-20 md:w-20">
                  <AvatarImage src={userData?.avatar_url} />
                  <AvatarFallback className="text-lg md:text-xl">{fullName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} disabled className="bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-4"><Mail className="w-4 h-4" />Email Notifications</h4>
                <div className="space-y-4">
                  {[
                    { key: 'emailNewMatch', label: 'New Matches', desc: 'Get notified when you have new AI matches' },
                    { key: 'emailNewReview', label: 'New Reviews', desc: 'Get notified when someone reviews your startup' },
                    { key: 'emailWeeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                      <Button
                        variant={notifications[item.key as keyof typeof notifications] ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      >
                        {notifications[item.key as keyof typeof notifications] ? <Check className="w-4 h-4" /> : 'Off'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end"><Button>Save Preferences</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div><p className="font-medium">Password</p><p className="text-sm text-muted-foreground">Last changed 30 days ago</p></div>
                </div>
                <Button variant="outline" onClick={handleChangePassword}>Change Password</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Add an extra layer of security</p></div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div><p className="font-medium text-red-600">Delete Account</p><p className="text-sm text-red-600/80">Permanently delete your account</p></div>
                </div>
                <Button variant="destructive" size="sm" className="mt-4">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="mb-2">Free Plan</Badge>
                    <h3 className="text-xl font-bold">Starter</h3>
                    <p className="text-sm text-muted-foreground">Perfect for getting started with EthAum</p>
                  </div>
                  <Button>Upgrade</Button>
                </div>
                <Separator className="my-4" />
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Launches</p><p className="font-medium">3 per month</p></div>
                  <div><p className="text-muted-foreground">AI Matches</p><p className="font-medium">10 per month</p></div>
                  <div><p className="text-muted-foreground">Analytics</p><p className="font-medium">Basic</p></div>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No payment methods added</p>
                <Button variant="outline" className="mt-4">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}