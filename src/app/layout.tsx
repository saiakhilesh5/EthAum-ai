import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@src/context/auth-context';
import { NotificationProvider } from '@src/context/notification-context';
import { Toaster } from 'sonner';
import { CommandPalette } from '@src/components/common/command-palette';
import { PWAInstallPrompt } from '@src/components/common/pwa-install';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ethaum.ai';

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'EthAum.ai - AI-Powered Enterprise Startup Intelligence',
    template: '%s | EthAum.ai',
  },
  description:
    'The AI-powered marketplace connecting enterprises with verified startups. Discover, evaluate, and partner with innovative solutions. Combining Product Hunt, G2, Gartner, and AppSumo.',
  keywords: [
    'SaaS marketplace',
    'startup launches',
    'product reviews',
    'AI insights',
    'enterprise matchmaking',
    'startup discovery',
    'B2B marketplace',
    'tech startups',
    'enterprise software',
    'AI-powered platform',
  ],
  authors: [{ name: 'EthAum.ai' }],
  creator: 'EthAum.ai',
  publisher: 'EthAum.ai',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#7c3aed' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'EthAum.ai',
    title: 'EthAum.ai - AI-Powered Enterprise Startup Intelligence',
    description: 'The AI-powered marketplace connecting enterprises with verified startups. Discover, evaluate, and partner with innovative solutions.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'EthAum.ai - Enterprise Startup Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EthAum.ai - AI-Powered Enterprise Startup Intelligence',
    description: 'The AI-powered marketplace connecting enterprises with verified startups.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@ethaumai',
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EthAum.ai" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <CommandPalette />
            <PWAInstallPrompt />
            <Toaster position="top-right" richColors closeButton />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}