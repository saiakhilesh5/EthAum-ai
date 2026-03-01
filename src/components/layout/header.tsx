'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@src/context/auth-context';
import { useUser } from '@src/hooks/use-user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Rocket,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Home,
  Compass,
  Zap,
  Building2,
  BarChart3,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NotificationCenter } from '@src/components/common/notification-center';
import { KeyboardShortcutsModal } from '@src/components/common/keyboard-shortcuts-modal';

const publicNavItems = [
  { title: 'Explore', href: '/explore', icon: Compass },
  { title: 'Launches', href: '/launches', icon: Zap },
  { title: 'Startups', href: '/startups', icon: Building2 },
  { title: 'Insights', href: '/insights', icon: BarChart3 },
];

export function Header() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { user, profile, isAuthenticated, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track when component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const headerContent = (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold">EthAum.ai</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button - Hidden on small mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex h-9 w-9"
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* While auth initialises OR user is known but profile is still fetching,
               show a skeleton — never show Login/Sign Up to a logged-in user */}
          {(isLoading || (user && !profile)) ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : profile ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:block">
                <NotificationCenter />
              </div>
              <div className="hidden lg:block">
                <KeyboardShortcutsModal />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile.avatar_url || ''}
                        alt={profile.full_name}
                      />
                      <AvatarFallback>
                        {getInitials(profile.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile.full_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {profile.user_type} Account
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              {/* Auth Buttons - Always visible */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );

  // Mobile Menu Portal - Rendered at document body level to avoid z-index issues
  const mobileMenuPortal = mounted ? createPortal(
    <>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Mobile Menu Content */}
      <div 
        className={cn(
          "fixed inset-x-0 top-14 sm:top-16 bottom-0 z-[9999] md:hidden bg-background border-t transition-all duration-300 ease-in-out",
          mobileMenuOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        )}
      >
        <div className="px-4 py-4 space-y-4 h-full overflow-y-auto pb-24">
          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
            <Link
              href="/"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t my-2" />

          {/* Auth Section for Mobile */}
          {/* Only show Login/Sign Up when we are certain the user is NOT logged in
              (no active session). While loading or profile still fetching, show nothing. */}
          {!isLoading && !user && !profile && (
            <div className="space-y-3">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Get Started</p>
              <Button className="w-full" size="lg" asChild>
                <Link href="/register">
                  <Rocket className="mr-2 h-4 w-4" />
                  Get Started Free
                </Link>
              </Button>
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href="/login">Log in to your account</Link>
              </Button>
            </div>
          )}

          {/* User Info for Mobile when logged in */}
          {profile && (
            <div className="space-y-3">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profile.avatar_url || ''}
                    alt={profile.full_name}
                  />
                  <AvatarFallback>
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{profile.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <div className="border-t my-2" />
                <button
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full text-left"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </div>
            </div>
          )}

          {/* Search on Mobile */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-search'));
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Search startups...
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      {headerContent}
      {mobileMenuPortal}
    </>
  );
}
