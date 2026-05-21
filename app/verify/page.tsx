'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useVerifyCertificate } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('');
  const [searched, setSearched] = useState(false);
  const { certificate, exists, isValid, isLoading, isError, error } =
    useVerifyCertificate(searched ? certificateId : '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setSearched(true);
  };

  const handleReset = () => {
    setCertificateId('');
    setSearched(false);
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
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
            Verify Certificate
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Certificate ID
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter certificate ID (e.g., CERT-001)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="flex-1 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0"
                  >
                    {isLoading ? 'Searching...' : 'Verify'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Results */}
          {searched && (
            <div className="space-y-6">
              {isLoading && (
                <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-300 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Verifying certificate...
                    </p>
                  </div>
                </Card>
              )}

              {searched && !isLoading && !exists && (
                <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 border-l-4 border-l-red-500">
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Certificate Not Found
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        No certificate found with this ID. Please check the ID and try again.
                      </p>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="sm"
                        className="mt-4 border-slate-300 dark:border-slate-700"
                      >
                        Try Another ID
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {isError && (
                <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 border-l-4 border-l-yellow-500">
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Error Loading Certificate
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {error?.message || 'Failed to verify certificate. Please try again.'}
                      </p>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="sm"
                        className="mt-4 border-slate-300 dark:border-slate-700"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {certificate && !isLoading && (
                <Card className={`p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 border-l-4 ${isValid ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={`w-6 h-6 ${isValid ? 'text-green-500' : 'text-red-500'}`} />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {isValid ? 'Certificate Valid' : 'Certificate Revoked'}
                        </h2>
                      </div>
                      <Badge className={isValid ? 'bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30'}>
                        {certificate.isRevoked ? 'Revoked' : 'Active'}
                      </Badge>
                    </div>

                    {/* Certificate Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Certificate ID
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1 break-all">
                          {certificate.certificateId}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Recipient Name
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                          {certificate.recipientName}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Course Name
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                          {certificate.courseName}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Completion Date
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                          {formatDate(certificate.completionDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Recipient Address
                        </p>
                        <p className="text-sm font-mono text-slate-900 dark:text-white mt-1 break-all">
                          {certificate.recipientAddress.slice(0, 6)}...
                          {certificate.recipientAddress.slice(-4)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Issued Date
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                          {formatDate(certificate.issuedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Blockchain Info */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Verified on blockchain</span>
                    </div>
                  </div>
                </Card>
              )}

              {!certificate && !isLoading && !isError && searched && (
                <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No results found. Try a different certificate ID.
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="mt-4 border-slate-300 dark:border-slate-700"
                  >
                    Try Another ID
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* Initial Empty State */}
          {!searched && (
            <Card className="p-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-center">
              <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Enter a certificate ID above to verify its authenticity
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
