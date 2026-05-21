import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Lock, Search, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              MSU TCTO
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Certificate Verification System
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Certificate Verification{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                on the Blockchain
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
              Securely verify MSU TCTO training certificates. Blockchain-backed
              verification for trust and transparency.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
            <Card className="p-4 sm:p-6 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <Search className="w-8 h-8 text-indigo-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Quick Verification
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Verify any certificate in seconds
              </p>
            </Card>

            <Card className="p-4 sm:p-6 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <Lock className="w-8 h-8 text-indigo-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Secure & Immutable
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Backed by blockchain technology
              </p>
            </Card>

            <Card className="p-4 sm:p-6 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
              <Zap className="w-8 h-8 text-indigo-600 mb-3 mx-auto" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Instant Results
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Real-time certificate status
              </p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/verify">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0 w-full sm:w-auto"
              >
                Verify Certificate
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 dark:border-slate-700 w-full sm:w-auto"
              >
                Admin Login
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Trusted by MSU TCTO • Powered by Blockchain
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            © 2024 MSU TCTO Certificate System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
