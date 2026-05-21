'use client';

import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useIsAuthorizedAdmin } from '@/lib/hooks/useBlockchainCertificates';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isConnected, address } = useAccount();
  const { isAuthorized, isLoading } = useIsAuthorizedAdmin();

  // Show connection prompt if wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="w-[160px]" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <div className="text-center space-y-6">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    You need to connect your wallet to access the admin dashboard
                  </p>
                </div>
                <div className="pt-4">
                  <ConnectButton />
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Show authorization check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="w-[160px]" />
          </div>
        </header>

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-slate-300 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-600 dark:text-slate-400">
                  Checking authorization...
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Show unauthorized message
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="w-[160px]" />
          </div>
        </header>

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 border-l-4 border-l-red-500">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Unauthorized
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Your wallet address ({address?.slice(0, 6)}...
                      {address?.slice(-4)}) is not authorized to access the admin
                      dashboard.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
                  <ConnectButton />
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 dark:border-slate-700"
                    >
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Show authorized dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Connected
                </span>
              </div>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
