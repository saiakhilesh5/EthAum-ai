import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Building2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold">Create your account</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose your account type to get started
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {/* Startup Option */}
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <Link href="/register/startup">
            <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base sm:text-lg">I'm a Startup</CardTitle>
                <CardDescription className="text-sm">
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
            <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base sm:text-lg">I'm an Enterprise</CardTitle>
                <CardDescription className="text-sm">
                  Discover startups, evaluate solutions, find partners
                </CardDescription>
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
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