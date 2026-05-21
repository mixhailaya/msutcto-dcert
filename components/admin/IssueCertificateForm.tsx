'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIssueCertificate } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';
import {
  Building2,
  CalendarDays,
  GraduationCap,
  Hash,
  Loader2,
  ShieldCheck,
  UserRound,
  Wallet,
} from 'lucide-react';

const schema = z.object({
  certificateId: z
    .string()
    .trim()
    .min(1, 'Certificate ID is required')
    .min(3, 'Certificate ID must be at least 3 characters'),
  recipientAddress: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  recipientName: z
    .string()
    .trim()
    .min(1, 'Recipient name is required')
    .min(2, 'Name must be at least 2 characters'),
  courseName: z
    .string()
    .trim()
    .min(1, 'Course name is required')
    .min(2, 'Course name must be at least 2 characters'),
  completionDate: z.string().min(1, 'Completion date is required'),
});

type FormData = z.infer<typeof schema>;

const fieldClass =
  'mt-2 h-11 border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950';

export function IssueCertificateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { issueCertificate, isPending, isError, error } = useIssueCertificate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      certificateId: '',
      recipientAddress: '',
      recipientName: '',
      courseName: '',
      completionDate: '',
    },
  });

  const values = watch();

  const completionPreview = useMemo(() => {
    if (!values.completionDate) return 'Not selected';
    return new Date(values.completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [values.completionDate]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const completionTimestamp = BigInt(
        Math.floor(new Date(data.completionDate).getTime() / 1000)
      );

      issueCertificate(
        data.certificateId.trim(),
        data.recipientAddress.trim() as `0x${string}`,
        data.recipientName.trim(),
        data.courseName.trim(),
        completionTimestamp
      );

      toast.success('Certificate issued. Processing blockchain transaction...');
      reset();
    } catch (err) {
      console.error('[v0] Error submitting form:', err);
      toast.error('Failed to issue certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5 sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Single certificate issuance
          </div>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Issue Certificate</h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Complete the required details below. The recipient wallet address must be a valid Ethereum-compatible address.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="certificateId" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Hash className="h-4 w-4" /> Certificate ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="certificateId"
              placeholder="e.g., CERT-2026-001"
              {...register('certificateId')}
              className={fieldClass}
              disabled={isPending}
            />
            {errors.certificateId && <p className="mt-1.5 text-sm text-red-500">{errors.certificateId.message}</p>}
          </div>

          <div>
            <Label htmlFor="completionDate" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CalendarDays className="h-4 w-4" /> Completion Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="completionDate"
              type="date"
              {...register('completionDate')}
              className={fieldClass}
              disabled={isPending}
            />
            {errors.completionDate && <p className="mt-1.5 text-sm text-red-500">{errors.completionDate.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="recipientAddress" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Wallet className="h-4 w-4" /> Recipient Wallet Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="recipientAddress"
            placeholder="0x742d35Cc6634C0532925a3b844Bc855e7d4D5f10"
            {...register('recipientAddress')}
            className={`${fieldClass} font-mono text-sm`}
            disabled={isPending}
          />
          {errors.recipientAddress && <p className="mt-1.5 text-sm text-red-500">{errors.recipientAddress.message}</p>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="recipientName" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <UserRound className="h-4 w-4" /> Recipient Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="recipientName"
              placeholder="Full name of recipient"
              {...register('recipientName')}
              className={fieldClass}
              disabled={isPending}
            />
            {errors.recipientName && <p className="mt-1.5 text-sm text-red-500">{errors.recipientName.message}</p>}
          </div>

          <div>
            <Label htmlFor="courseName" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <GraduationCap className="h-4 w-4" /> Course Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="courseName"
              placeholder="Name of training/course"
              {...register('courseName')}
              className={fieldClass}
              disabled={isPending}
            />
            {errors.courseName && <p className="mt-1.5 text-sm text-red-500">{errors.courseName.message}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Building2 className="h-4 w-4" /> Issuer
          </Label>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">MSU TCTO</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">The issuer name is displayed as the official certificate authority.</p>
        </div>

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-400">{error?.message || 'Failed to issue certificate. Please try again.'}</p>
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
              Processing Transaction...
            </>
          ) : (
            'Issue Certificate'
          )}
        </Button>
      </form>

      <aside className="border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 lg:border-l lg:border-t-0 sm:p-8">
        <div className="sticky top-24 space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Live Preview</p>
            <h4 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">Certificate Summary</h4>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <PreviewRow label="Certificate ID" value={values.certificateId || 'Not entered'} mono />
            <PreviewRow label="Recipient" value={values.recipientName || 'Not entered'} />
            <PreviewRow label="Course" value={values.courseName || 'Not entered'} />
            <PreviewRow label="Completion Date" value={completionPreview} />
            <PreviewRow label="Wallet" value={values.recipientAddress || 'Not entered'} mono truncate />
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            Review all fields before submission. Blockchain transactions may require gas and cannot be edited after confirmation.
          </div>
        </div>
      </aside>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  mono,
  truncate,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-semibold text-slate-900 dark:text-white ${mono ? 'font-mono' : ''} ${truncate ? 'truncate' : ''}`}>
        {value}
      </p>
    </div>
  );
}
