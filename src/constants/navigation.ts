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
    title: 'My Launches',
    href: '/launches',
    icon: Rocket,
  },
  {
    title: 'Reviews',
    href: '/reviews',
    icon: Star,
  },
  {
    title: 'Insights',
    href: '/insights',
    icon: BarChart3,
  },
  {
    title: 'Matchmaking',
    href: '/matchmaking',
    icon: Handshake,
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
    title: 'Explore Startups',
    href: '/explore',
    icon: Compass,
  },
  {
    title: 'Matches',
    href: '/matchmaking',
    icon: Handshake,
  },
  {
    title: 'Compare Tool',
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