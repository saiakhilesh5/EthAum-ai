'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="text-center px-4">
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-muted-foreground/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" asChild>
            <Link href="/explore">
              <Search className="w-4 h-4 mr-2" />
              Explore Startups
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
