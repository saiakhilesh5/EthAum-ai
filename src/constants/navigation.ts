import {
  LayoutDashboard,
  Rocket,
  Star,
  BarChart3,
  Handshake,
  User,
  Settings,
  Compass,
  Building2,
  TrendingUp,
  FileText,
  Scale,
  Sparkles,
  Presentation,
  Zap,
} from 'lucide-react';

export const STARTUP_NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Product Launches',
    href: '/launches',
    icon: Rocket,
  },
  {
    title: 'Enterprise Reviews',
    href: '/reviews',
    icon: Star,
  },
  {
    title: 'Credibility Signals',
    href: '/insights',
    icon: BarChart3,
    badge: 'AI',
  },
  {
    title: 'Enterprise Matches',
    href: '/matchmaking',
    icon: Handshake,
    badge: 'AI',
  },
  {
    title: 'Pitch Analyzer',
    href: '/pitch-analyzer',
    icon: Presentation,
    badge: 'AI',
  },
  {
    title: 'Deal Predictor',
    href: '/deal-predictor',
    icon: Zap,
    badge: 'AI',
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const ENTERPRISE_NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Enterprise-Ready Startups',
    href: '/explore',
    icon: Compass,
  },
  {
    title: 'AI Matches',
    href: '/matchmaking',
    icon: Handshake,
    badge: 'AI',
  },
  {
    title: 'Startup Compare',
    href: '/compare',
    icon: Scale,
    badge: 'AI',
  },
  {
    title: 'Executive Briefs',
    href: '/executive-brief',
    icon: FileText,
    badge: 'AI',
  },
  {
    title: 'Deal Predictor',
    href: '/deal-predictor',
    icon: Zap,
    badge: 'AI',
  },
  {
    title: 'Trending',
    href: '/insights',
    icon: TrendingUp,
  },
  {
    title: 'Company Profile',
    href: '/profile',
    icon: Building2,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const PUBLIC_NAV_ITEMS = [
  {
    title: 'Explore',
    href: '/explore',
  },
  {
    title: 'Launches',
    href: '/launches',
  },
  {
    title: 'Startups',
    href: '/startups',
  },
  {
    title: 'Insights',
    href: '/insights',
  },
];