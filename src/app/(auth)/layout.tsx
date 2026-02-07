import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
            <Rocket className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-primary-foreground">
            EthAum.ai
          </span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
            Launch, Validate & Grow Your Startup
          </h1>
          <p className="text-base lg:text-lg text-primary-foreground/80">
            Join the AI-powered marketplace trusted by hundreds of Series A to D
            startups. Get discovered by enterprise buyers, collect verified
            reviews, and accelerate your growth.
          </p>
          <div className="flex items-center justify-start space-x-6 lg:space-x-8 text-primary-foreground/80">
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-primary-foreground">500+</div>
              <div className="text-xs lg:text-sm">Startups</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-primary-foreground">10K+</div>
              <div className="text-xs lg:text-sm">Reviews</div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-bold text-primary-foreground">$2.5M+</div>
              <div className="text-xs lg:text-sm">Deals Made</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} EthAum.ai. All rights reserved.
        </p>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 sm:mb-8 text-center">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary">
                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">EthAum.ai</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}