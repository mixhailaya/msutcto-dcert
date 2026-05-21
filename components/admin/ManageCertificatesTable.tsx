'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRevokeCertificate, useGetAllCertificatesBatch } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';
import { Ban, ClipboardList, Loader2, RefreshCw, Search, ShieldCheck, Trash2 } from 'lucide-react';

export function ManageCertificatesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [revoking, setRevoking] = useState<string | null>(null);
  const { revokeCertificate, isPending: isRevoking } = useRevokeCertificate();
  const { data: certificates, isLoading, error, refetch } = useGetAllCertificatesBatch();

  const filteredCertificates = useMemo(() => {
    if (!certificates || !Array.isArray(certificates)) return [];
    if (!searchTerm.trim()) return certificates;

    const searchLower = searchTerm.toLowerCase();

    return certificates.filter((cert) => {
      if (!cert) return false;

      const id = cert.id?.toLowerCase() || '';
      const recipient = cert.recipient?.toLowerCase() || '';
      const course = cert.course?.toLowerCase() || '';
      const status = cert.status?.toLowerCase() || '';

      return id.includes(searchLower) || recipient.includes(searchLower) || course.includes(searchLower) || status.includes(searchLower);
    });
  }, [certificates, searchTerm]);

  const summary = useMemo(() => {
    const list = Array.isArray(certificates) ? certificates : [];
    const active = list.filter((cert) => cert?.status === 'valid').length;
    const revoked = list.length - active;
    return { total: list.length, active, revoked };
  }, [certificates]);

  const handleRevoke = async (certificateId: string) => {
    if (!certificateId) return;

    if (confirm(`Are you sure you want to revoke certificate ${certificateId}? This action cannot be undone.`)) {
      setRevoking(certificateId);
      try {
        await revokeCertificate(certificateId);
        toast.success('Certificate revocation submitted');
        setTimeout(() => refetch(), 2000);
      } catch (error) {
        toast.error('Failed to revoke certificate');
        console.error(error);
      } finally {
        setRevoking(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
          <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
          <div className="text-center">
            <p className="font-semibold text-slate-900 dark:text-white">Loading certificates</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Fetching blockchain certificate records...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <Ban className="h-10 w-10 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300">Error loading certificates</p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message || 'Failed to load certificates'}</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="border-red-200 bg-white dark:border-red-900/50 dark:bg-red-950/30">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-5 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <ClipboardList className="h-3.5 w-3.5" />
            Certificate records
          </div>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Manage Certificates</h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Search issued certificates, monitor active and revoked records, and revoke certificates when required.
          </p>
        </div>

        <Button onClick={() => refetch()} variant="outline" className="gap-2 border-slate-300 dark:border-slate-700">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Total Records" value={summary.total} icon={<ClipboardList className="h-5 w-5" />} />
        <SummaryCard label="Active" value={summary.active} icon={<ShieldCheck className="h-5 w-5" />} tone="green" />
        <SummaryCard label="Revoked" value={summary.revoked} icon={<Ban className="h-5 w-5" />} tone="red" />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by ID, recipient, course, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 border-slate-300 bg-white pl-10 dark:border-slate-700 dark:bg-slate-950"
        />
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50 dark:bg-slate-950/70">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <TableHead>Certificate ID</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-950/20">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert, index) => (
                  <tr key={cert.id || index} className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-900/60">
                    <td className="px-4 py-4">
                      <code className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-sm font-semibold text-slate-900 dark:bg-slate-900 dark:text-white">
                        {cert.id || 'N/A'}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">{cert.recipient || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{cert.course || 'N/A'}</td>
                    <td className="px-4 py-4"><StatusBadge status={cert.status} /></td>
                    <td className="px-4 py-4 text-right"><RevokeButton cert={cert} isRevoking={isRevoking} revoking={revoking} onRevoke={handleRevoke} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-600 dark:text-slate-400">
                    {searchTerm ? 'No certificates match your search.' : 'No certificates found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((cert, index) => (
            <div key={cert.id || index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Certificate ID</p>
                  <code className="mt-1 block truncate font-mono text-sm font-bold text-slate-900 dark:text-white">{cert.id || 'N/A'}</code>
                </div>
                <StatusBadge status={cert.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <MobileRow label="Recipient" value={cert.recipient || 'N/A'} />
                <MobileRow label="Course" value={cert.course || 'N/A'} />
              </div>
              <div className="mt-4 flex justify-end">
                <RevokeButton cert={cert} isRevoking={isRevoking} revoking={revoking} onRevoke={handleRevoke} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            {searchTerm ? 'No certificates match your search.' : 'No certificates found.'}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
        Showing {filteredCertificates.length} of {certificates?.length || 0} certificate(s)
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, tone = 'slate' }: { label: string; value: number; icon: ReactNode; tone?: 'slate' | 'green' | 'red' }) {
  const toneClass = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${toneClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function TableHead({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const isValid = status === 'valid';
  return (
    <Badge className={isValid ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300'}>
      {isValid ? 'Active' : 'Revoked'}
    </Badge>
  );
}

function RevokeButton({
  cert,
  isRevoking,
  revoking,
  onRevoke,
}: {
  cert: { id?: string; status?: string };
  isRevoking: boolean;
  revoking: string | null;
  onRevoke: (certificateId: string) => void;
}) {
  if (cert.status !== 'valid' || !cert.id) return null;

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => onRevoke(cert.id!)}
      disabled={isRevoking || revoking === cert.id}
      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
    >
      {revoking === cert.id ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Revoking...
        </>
      ) : (
        <>
          <Trash2 className="mr-1 h-4 w-4" />
          Revoke
        </>
      )}
    </Button>
  );
}

function MobileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
