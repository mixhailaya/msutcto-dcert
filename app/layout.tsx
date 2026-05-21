import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from './providers';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MSU TCTO Certificate Verification',
    template: '%s | MSU TCTO Certificate Verification',
  },
  description:
    'Blockchain-backed certificate verification and issuance system for MSU TCTO.',
  generator: 'v0.app',
  applicationName: 'MSU TCTO Certificate Verification',
  keywords: [
    'MSU TCTO',
    'certificate verification',
    'blockchain certificates',
    'academic credentials',
  ],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  userScalable: true,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-slate-50 font-sans antialiased text-slate-950 selection:bg-indigo-200 selection:text-indigo-950 dark:bg-slate-950 dark:text-white dark:selection:bg-indigo-500/40 dark:selection:text-white">
        <Providers>
          <div className="relative min-h-screen">
            {children}
          </div>
        </Providers>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}