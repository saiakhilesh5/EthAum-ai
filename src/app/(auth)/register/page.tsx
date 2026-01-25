import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Building2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">
          Choose your account type to get started
        </p>
      </div>

      <div className="grid gap-4">
        {/* Startup Option */}
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <Link href="/register/startup">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Rocket className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">I'm a Startup</CardTitle>
                <CardDescription>
                  Launch products, collect reviews, get discovered
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create product launches</li>
                <li>• Build credibility with reviews</li>
                <li>• Connect with enterprise buyers</li>
                <li>• AI-powered insights</li>
              </ul>
            </CardContent>
          </Link>
        </Card>

        {/* Enterprise Option */}
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <Link href="/register/enterprise">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Building2 className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">I'm an Enterprise Buyer</CardTitle>
                <CardDescription>
                  Discover startups, evaluate solutions, find partners
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browse verified startups</li>
                <li>• AI-matched recommendations</li>
                <li>• Request demos and pilots</li>
                <li>• Read authentic reviews</li>
              </ul>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}