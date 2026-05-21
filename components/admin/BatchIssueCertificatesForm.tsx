'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBatchIssueCertificates } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';
import { Download, FileJson, Loader2, UploadCloud } from 'lucide-react';

interface BatchCertificate {
  certificateId: string;
  recipientAddress: string;
  recipientName: string;
  courseName: string;
  completionDate: string;
}

const template: BatchCertificate[] = [
  {
    certificateId: 'CERT-2026-001',
    recipientAddress: '0x742d35Cc6634C0532925a3b844Bc855e7d4D5f10',
    recipientName: 'John Doe',
    courseName: 'Blockchain Training',
    completionDate: '2026-01-15',
  },
  {
    certificateId: 'CERT-2026-002',
    recipientAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    recipientName: 'Jane Smith',
    courseName: 'Blockchain Training',
    completionDate: '2026-01-15',
  },
];

export function BatchIssueCertificatesForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { batchIssueCertificates, isPending, isError, error } = useBatchIssueCertificates();

  const parsedPreview = useMemo(() => {
    if (!jsonInput.trim()) return { count: 0, valid: false, message: 'Paste JSON to preview batch size.' };

    try {
      const parsed = JSON.parse(jsonInput) as BatchCertificate[];
      if (!Array.isArray(parsed)) return { count: 0, valid: false, message: 'JSON must be an array.' };
      return {
        count: parsed.length,
        valid: parsed.length > 0 && parsed.length <= 100,
        message: parsed.length > 100 ? 'Maximum 100 certificates per batch.' : `${parsed.length} certificate record(s) detected.`,
      };
    } catch {
      return { count: 0, valid: false, message: 'JSON is not valid yet.' };
    }
  }, [jsonInput]);

  const handleDownloadTemplate = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(template, null, 2))}`);
    element.setAttribute('download', 'certificate-template.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Template downloaded');
  };

  const handleUseTemplate = () => {
    setJsonInput(JSON.stringify(template, null, 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonInput.trim()) {
      toast.error('Please paste JSON data');
      return;
    }

    try {
      const parsed: BatchCertificate[] = JSON.parse(jsonInput);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        toast.error('JSON must be an array with at least one certificate');
        return;
      }

      if (parsed.length > 100) {
        toast.error('Maximum 100 certificates per batch');
        return;
      }

      const isValid = parsed.every(
        (cert) =>
          cert.certificateId?.trim() &&
          cert.recipientAddress?.trim() &&
          cert.recipientName?.trim() &&
          cert.courseName?.trim() &&
          cert.completionDate?.trim()
      );

      if (!isValid) {
        toast.error('Missing required fields. Check certificateId, recipientAddress, recipientName, courseName, and completionDate.');
        return;
      }

      const validAddresses = parsed.every((cert) => /^0x[a-fA-F0-9]{40}$/.test(cert.recipientAddress.trim()));
      if (!validAddresses) {
        toast.error('Invalid Ethereum address format. Expected 0x followed by 40 hex characters.');
        return;
      }

      const validDates = parsed.every((cert) => !Number.isNaN(new Date(cert.completionDate).getTime()));
      if (!validDates) {
        toast.error('Invalid completionDate. Use YYYY-MM-DD format.');
        return;
      }

      const certificates = parsed.map((cert) => ({
        certificateId: cert.certificateId.trim(),
        recipientAddress: cert.recipientAddress.trim() as `0x${string}`,
        recipientName: cert.recipientName.trim(),
        courseName: cert.courseName.trim(),
        completionDate: BigInt(Math.floor(new Date(cert.completionDate).getTime() / 1000)),
      }));

      setIsSubmitting(true);
      batchIssueCertificates(certificates);
      toast.success(`Issuing ${certificates.length} certificate(s)...`);
      setJsonInput('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else {
        console.error('[v0] Error processing batch:', err);
        toast.error('Failed to process batch');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              <UploadCloud className="h-3.5 w-3.5" />
              Batch certificate issuance
            </div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Batch Import</h3>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Paste a JSON array to issue multiple certificates in one transaction workflow. Use the template to avoid missing fields.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" size="sm" onClick={handleUseTemplate} className="gap-2 border-slate-300 dark:border-slate-700">
              <FileJson className="h-4 w-4" />
              Use Sample
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2 border-slate-300 dark:border-slate-700">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <Label className="text-slate-700 dark:text-slate-300">
              JSON Data <span className="text-red-500">*</span>
            </Label>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${parsedPreview.valid ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'}`}>
              {parsedPreview.count} record(s)
            </span>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={JSON.stringify(template, null, 2)}
            className="h-[28rem] w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            disabled={isPending}
          />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{parsedPreview.message}</p>
        </div>

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-400">{error?.message || 'Failed to process batch. Please try again.'}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending || isSubmitting}
          className="h-12 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-700 hover:to-blue-700"
        >
          {isPending || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Batch...
            </>
          ) : (
            `Issue Batch${parsedPreview.count ? ` (${parsedPreview.count})` : ''}`
          )}
        </Button>
      </form>

      <aside className="border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 lg:border-l lg:border-t-0 sm:p-8">
        <div className="sticky top-24 space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Required JSON Fields</p>
            <h4 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">Import Guide</h4>
          </div>

          <div className="space-y-3">
            {[
              ['certificateId', 'Unique certificate reference, e.g., CERT-2026-001'],
              ['recipientAddress', 'Ethereum-compatible wallet address beginning with 0x'],
              ['recipientName', 'Full name of the certificate holder'],
              ['courseName', 'Training, seminar, or course title'],
              ['completionDate', 'Date format: YYYY-MM-DD'],
            ].map(([field, description]) => (
              <div key={field} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{field}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
            Recommended limit: 100 certificates per batch to keep the transaction manageable.
          </div>
        </div>
      </aside>
    </div>
  );
}
