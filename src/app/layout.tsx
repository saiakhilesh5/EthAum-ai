import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@src/context/auth-context';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EthAum.ai - AI-Powered SaaS Marketplace',
  description:
    'Discover, launch, and grow your startup with AI-powered insights. Combining the best of Product Hunt, G2, Gartner, and AppSumo for Series A to D startups.',
  keywords: [
    'SaaS marketplace',
    'startup launches',
    'product reviews',
    'AI insights',
    'enterprise matchmaking',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}