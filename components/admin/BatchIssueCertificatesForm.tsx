'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBatchIssueCertificates } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';
import { Loader2, Download } from 'lucide-react';

interface BatchCertificate {
  certificateId: string;
  recipientAddress: string;
  recipientName: string;
  courseName: string;
  completionDate: string;
}

export function BatchIssueCertificatesForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { batchIssueCertificates, isPending, isError, error } =
    useBatchIssueCertificates();

  const handleDownloadTemplate = () => {
    const template = [
      {
        certificateId: 'CERT-001',
        recipientAddress: '0x742d35Cc6634C0532925a3b844Bc855e7d4D5f10',
        recipientName: 'John Doe',
        courseName: 'Advanced Training',
        completionDate: '2024-01-15',
      },
      {
        certificateId: 'CERT-002',
        recipientAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        recipientName: 'Jane Smith',
        courseName: 'Advanced Training',
        completionDate: '2024-01-15',
      },
    ];

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2))
    );
    element.setAttribute('download', 'certificate-template.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Template downloaded!');
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

      // Validate structure
      const isValid = parsed.every(
        (cert) =>
          cert.certificateId &&
          cert.recipientAddress &&
          cert.recipientName &&
          cert.courseName &&
          cert.completionDate
      );

      if (!isValid) {
        toast.error(
          'Missing required fields. Check: certificateId, recipientAddress, recipientName, courseName, completionDate'
        );
        return;
      }

      // Validate Ethereum addresses
      const validAddresses = parsed.every((cert) => /^0x[a-fA-F0-9]{40}$/.test(cert.recipientAddress));
      if (!validAddresses) {
        toast.error('Invalid Ethereum address format. Expected 0x... format');
        return;
      }

      // Convert to bigint timestamps
      const certificates = parsed.map((cert) => ({
        certificateId: cert.certificateId,
        recipientAddress: cert.recipientAddress as `0x${string}`,
        recipientName: cert.recipientName,
        courseName: cert.courseName,
        completionDate: BigInt(
          Math.floor(new Date(cert.completionDate).getTime() / 1000)
        ),
      }));

      setIsSubmitting(true);
      batchIssueCertificates(certificates);
      toast.success(`Issuing ${certificates.length} certificates...`);
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
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-slate-700 dark:text-slate-300">
            JSON Data <span className="text-red-500">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-2 border-slate-300 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`[
  {
    "certificateId": "CERT-001",
    "recipientName": "John Doe",
    "courseName": "Advanced Training",
    "completionDate": "2024-01-15"
  }
]`}
          className="w-full h-64 p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 font-mono text-sm resize-none"
          disabled={isPending}
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">
          Format Requirements:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Must be a JSON array of certificate objects</li>
          <li>Each certificate must have: certificateId, recipientName, courseName, completionDate</li>
          <li>completionDate format: YYYY-MM-DD (e.g., 2024-01-15)</li>
          <li>Maximum 100 certificates per batch</li>
        </ul>
      </div>

      {isError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <p className="text-sm text-red-700 dark:text-red-400">
            {error?.message || 'Failed to process batch. Please try again.'}
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || isSubmitting}
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0"
      >
        {isPending || isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Issue Batch'
        )}
      </Button>
    </form>
  );
}
