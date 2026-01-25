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