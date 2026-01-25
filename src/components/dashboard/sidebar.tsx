'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@src/hooks/use-user';
import {
  Rocket,
  LayoutDashboard,
  Zap,
  Star,
  BarChart3,
  Handshake,
  User,
  Settings,
  Compass,
  Building2,
  TrendingUp,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@src/context/auth-context';

const startupNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Launches',
    href: '/launches',
    icon: Zap,
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
];

const enterpriseNavItems = [
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
    title: 'My Matches',
    href: '/matchmaking',
    icon: Handshake,
  },
  {
    title: 'Trending',
    href: '/insights',
    icon: TrendingUp,
  },
];

const bottomNavItems = [
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
  {
    title: 'Help',
    href: '/help',
    icon: HelpCircle,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isStartup, isEnterprise } = useUser();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = isEnterprise ? enterpriseNavItems : startupNavItems;

  return (
    <div
      className={cn(
        'relative flex flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold">EthAum.ai</span>
          )}
        </Link>
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Quick Action */}
      {isStartup && (
        <div className="p-4">
          <Button
            asChild
            className={cn('w-full', isCollapsed && 'px-2')}
          >
            <Link href="/launches/new">
              <Plus className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">New Launch</span>}
            </Link>
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t p-3">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
          <button
            onClick={() => signOut()}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground',
              isCollapsed && 'justify-center px-2'
            )}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}