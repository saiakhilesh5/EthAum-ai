'use client';

import Link from 'next/link';
import { WifiOff, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
            Offline
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          You're Offline
        </h1>
        <p className="text-muted-foreground mb-8">
          It looks like you've lost your internet connection. Don't worry, 
          some features may still be available from your cached data.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-12 p-4 bg-muted/50 rounded-lg text-left">
          <h3 className="font-semibold mb-2">While you're offline:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Previously viewed pages may be available</li>
            <li>• Check your WiFi or mobile data connection</li>
            <li>• Move to an area with better signal</li>
            <li>• Your pending actions will sync when online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
