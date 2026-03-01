import Link from 'next/link';
import { Rocket } from 'lucide-react';

const footerLinks = {
  product: [
    { title: 'Explore Startups', href: '/explore' },
    { title: 'Launches', href: '/launches' },
    { title: 'Reviews', href: '/reviews' },
    { title: 'Matchmaking', href: '/matchmaking' },
  ],
  tools: [
    { title: 'Pitch Analyzer', href: '/pitch-analyzer' },
    { title: 'Deal Predictor', href: '/deal-predictor' },
    { title: 'Compare Tool', href: '/compare' },
    { title: 'Executive Briefs', href: '/executive-brief' },
  ],
  getStarted: [
    { title: 'For Startups', href: '/register/startup' },
    { title: 'For Enterprises', href: '/register/enterprise' },
    { title: 'Login', href: '/login' },
    { title: 'Dashboard', href: '/dashboard' },
  ],
  insights: [
    { title: 'Analytics', href: '/insights' },
    { title: 'Settings', href: '/settings' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EthAum.ai</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              AI-powered SaaS marketplace for Series A to D startups. Launch, validate, and grow.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools Links */}
          <div>
            <h3 className="font-semibold mb-4">AI Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started Links */}
          <div>
            <h3 className="font-semibold mb-4">Get Started</h3>
            <ul className="space-y-2">
              {footerLinks.getStarted.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insights Links */}
          <div>
            <h3 className="font-semibold mb-4">Insights</h3>
            <ul className="space-y-2">
              {footerLinks.insights.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            © {new Date().getFullYear()} EthAum.ai. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Built with ❤️ for the startup ecosystem
          </p>
        </div>
      </div>
    </footer>
  );
}