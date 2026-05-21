'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck2,
  HelpCircle,
  Loader2,
  RotateCcw,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useVerifyCertificate } from '@/lib/hooks/useBlockchainCertificates';

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('');
  const [submittedCertificateId, setSubmittedCertificateId] = useState('');
  const [searched, setSearched] = useState(false);

  const cleanCertificateId = useMemo(
    () => submittedCertificateId.trim(),
    [submittedCertificateId]
  );

  const { certificate, exists, isValid, isLoading, isError, error } =
    useVerifyCertificate(searched ? cleanCertificateId : '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = certificateId.trim();

    if (!value) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setSubmittedCertificateId(value);
    setSearched(true);
  };

  const handleReset = () => {
    setCertificateId('');
    setSubmittedCertificateId('');
    setSearched(false);
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Unable to copy ${label.toLowerCase()}`);
    }
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) * 1000);

      if (Number.isNaN(date.getTime())) {
        return 'Unknown';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  const statusStyles = isValid
    ? {
        icon: CheckCircle2,
        title: 'Certificate Valid',
        description:
          'This certificate record exists on the blockchain and has not been revoked.',
        badge: 'Active',
        accent: 'border-l-emerald-500',
        iconClass: 'text-emerald-600 dark:text-emerald-400',
        badgeClass:
          'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300',
        panelClass:
          'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/30',
      }
    : {
        icon: XCircle,
        title: 'Certificate Revoked',
        description:
          'This certificate exists, but it is marked as revoked and should not be treated as valid.',
        badge: 'Revoked',
        accent: 'border-l-red-500',
        iconClass: 'text-red-600 dark:text-red-400',
        badgeClass:
          'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300',
        panelClass:
          'border-red-200 bg-red-50/80 dark:border-red-900/60 dark:bg-red-950/30',
      };

  const StatusIcon = statusStyles.icon;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_48%,_#f8fafc_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#0f172a_52%,_#020617_100%)] dark:text-white">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Back to home">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">
                Blockchain Verification
              </p>
              <h1 className="truncate text-base font-bold text-slate-950 dark:text-white sm:text-xl">
                Verify Certificate
              </h1>
            </div>
          </div>

          <Badge className="hidden border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 sm:inline-flex">
            Public Lookup
          </Badge>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:items-start">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-indigo-950/5 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-black/20 sm:p-8 lg:p-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure certificate authenticity checker
              </div>

              <div className="space-y-4">
                <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                  Confirm if a certificate is authentic, active, and recorded
                  on-chain.
                </h2>

                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  Enter the certificate ID provided by the issuing office. The
                  system checks the blockchain record and shows the certificate
                  details, status, recipient, and issuance information.
                </p>
              </div>

              <form onSubmit={handleSearch} className="mt-8 space-y-4">
                <label
                  htmlFor="certificateId"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                  Certificate ID
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="certificateId"
                      type="text"
                      placeholder="Example: CERT-001 or CCS-2026-0001"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="h-12 border-slate-200 bg-white pl-10 text-base text-slate-950 shadow-sm placeholder:text-slate-400 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 min-w-full gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-blue-700 sm:min-w-36"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Tip: Copy the certificate ID exactly as printed on the
                  certificate or sent by the issuing office.
                </p>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: 'Search',
                  text: 'Enter the unique certificate ID.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Validate',
                  text: 'Check its blockchain record.',
                },
                {
                  icon: FileCheck2,
                  title: 'Confirm',
                  text: 'Review the official details.',
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <item.icon className="mb-3 h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  <h3 className="font-bold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-24">
            {!searched && (
              <Card className="overflow-hidden border-white/70 bg-white/85 shadow-xl shadow-indigo-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-7">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <FileCheck2 className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Ready to verify
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Certificate information will appear here after
                    verification.
                  </p>
                </div>

                <div className="space-y-4 p-6 sm:p-7">
                  {[
                    'Certificate ID and status',
                    'Recipient name and wallet address',
                    'Course name and completion date',
                    'Issuance date and revocation status',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {searched && isLoading && (
              <Card className="border-white/70 bg-white/85 p-8 text-center shadow-xl shadow-indigo-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>

                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Verifying certificate
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Checking the blockchain record for {cleanCertificateId}.
                </p>
              </Card>
            )}

            {searched && !isLoading && !exists && !isError && (
              <Card className="border-l-4 border-l-red-500 bg-white/90 p-6 shadow-xl shadow-indigo-950/5 dark:bg-slate-950/80 sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                    <AlertCircle className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                      Certificate not found
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      No blockchain record was found for{' '}
                      <span className="font-semibold text-slate-950 dark:text-white">
                        {cleanCertificateId}
                      </span>
                      . Please check the ID and try again.
                    </p>

                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="mt-5 gap-2 border-slate-200 dark:border-slate-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try another ID
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {isError && (
              <Card className="border-l-4 border-l-amber-500 bg-white/90 p-6 shadow-xl shadow-indigo-950/5 dark:bg-slate-950/80 sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                    <AlertCircle className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                      Error loading certificate
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {error?.message ||
                        'Failed to verify the certificate. Please try again.'}
                    </p>

                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="mt-5 gap-2 border-slate-200 dark:border-slate-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try again
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {certificate && !isLoading && (
              <Card
                className={`overflow-hidden border-white/70 bg-white/90 shadow-xl shadow-indigo-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 ${statusStyles.accent} border-l-4`}
              >
                <div
                  className={`border-b p-6 dark:border-slate-800 sm:p-7 ${statusStyles.panelClass}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-950">
                        <StatusIcon
                          className={`h-7 w-7 ${statusStyles.iconClass}`}
                        />
                      </div>

                      <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                          {statusStyles.title}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {statusStyles.description}
                        </p>
                      </div>
                    </div>

                    <Badge className={statusStyles.badgeClass}>
                      {certificate.isRevoked ? 'Revoked' : statusStyles.badge}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Certificate ID"
                      value={certificate.certificateId}
                      mono
                      onCopy={() =>
                        handleCopy(certificate.certificateId, 'Certificate ID')
                      }
                    />

                    <DetailItem
                      label="Recipient Name"
                      value={certificate.recipientName}
                    />

                    <DetailItem
                      label="Course Name"
                      value={certificate.courseName}
                    />

                    <DetailItem
                      label="Completion Date"
                      value={formatDate(certificate.completionDate)}
                    />

                    <DetailItem
                      label="Recipient Address"
                      value={certificate.recipientAddress}
                      displayValue={`${certificate.recipientAddress.slice(
                        0,
                        6
                      )}...${certificate.recipientAddress.slice(-4)}`}
                      mono
                      onCopy={() =>
                        handleCopy(
                          certificate.recipientAddress,
                          'Recipient address'
                        )
                      }
                    />

                    <DetailItem
                      label="Issued Date"
                      value={formatDate(certificate.issuedAt)}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="h-4 w-4 flex-none text-indigo-600 dark:text-indigo-300" />
                      <span>
                        Verified using blockchain certificate records.
                      </span>
                    </div>

                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Verify another
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {searched && !certificate && !isLoading && !isError && exists && (
              <Card className="bg-white/90 p-8 text-center shadow-xl shadow-indigo-950/5 dark:bg-slate-950/80">
                <AlertCircle className="mx-auto mb-3 h-9 w-9 text-slate-400" />

                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                  No certificate details available
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Try a different certificate ID or check your blockchain
                  connection.
                </p>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="mt-5 border-slate-200 dark:border-slate-700"
                >
                  Try another ID
                </Button>
              </Card>
            )}

            <Card className="border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 flex-none text-indigo-600 dark:text-indigo-300" />

                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white">
                    Having trouble?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Make sure your wallet or provider is connected to the same
                    network where the certificate was issued.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
  displayValue?: string;
  mono?: boolean;
  onCopy?: () => void;
};

function DetailItem({
  label,
  value,
  displayValue,
  mono = false,
  onCopy,
}: DetailItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>

        {onCopy && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCopy}
            aria-label={`Copy ${label}`}
            className="h-7 w-7 rounded-full text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <p
        title={value}
        className={`break-words text-sm font-semibold text-slate-950 dark:text-white sm:text-base ${
          mono ? 'font-mono' : ''
        }`}
      >
        {displayValue || value}
      </p>
    </div>
  );
}