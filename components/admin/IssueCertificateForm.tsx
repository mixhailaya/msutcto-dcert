'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIssueCertificate } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  certificateId: z
    .string()
    .min(1, 'Certificate ID is required')
    .min(3, 'Certificate ID must be at least 3 characters'),
  recipientAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  recipientName: z
    .string()
    .min(1, 'Recipient name is required')
    .min(2, 'Name must be at least 2 characters'),
  courseName: z
    .string()
    .min(1, 'Course name is required')
    .min(2, 'Course name must be at least 2 characters'),
  completionDate: z.string().min(1, 'Completion date is required'),
});

type FormData = z.infer<typeof schema>;

export function IssueCertificateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { issueCertificate, isPending, isError, error } =
    useIssueCertificate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const completionTimestamp = BigInt(
        Math.floor(new Date(data.completionDate).getTime() / 1000)
      );

      issueCertificate(
        data.certificateId,
        data.recipientAddress as `0x${string}`,
        data.recipientName,
        data.courseName,
        completionTimestamp
      );

      toast.success('Certificate issued! Processing transaction...');
      reset();
    } catch (err) {
      console.error('[v0] Error submitting form:', err);
      toast.error('Failed to issue certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
      <div>
        <Label htmlFor="certificateId" className="text-slate-700 dark:text-slate-300">
          Certificate ID <span className="text-red-500">*</span>
        </Label>
        <Input
          id="certificateId"
          placeholder="e.g., CERT-001"
          {...register('certificateId')}
          className="mt-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          disabled={isPending}
        />
        {errors.certificateId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.certificateId.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="recipientAddress" className="text-slate-700 dark:text-slate-300">
          Recipient Wallet Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="recipientAddress"
          placeholder="0x..."
          {...register('recipientAddress')}
          className="mt-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
          disabled={isPending}
        />
        {errors.recipientAddress && (
          <p className="mt-1 text-sm text-red-500">
            {errors.recipientAddress.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="recipientName" className="text-slate-700 dark:text-slate-300">
          Recipient Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="recipientName"
          placeholder="Full name of certificate recipient"
          {...register('recipientName')}
          className="mt-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          disabled={isPending}
        />
        {errors.recipientName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.recipientName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="courseName" className="text-slate-700 dark:text-slate-300">
          Course Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="courseName"
          placeholder="Name of the training course"
          {...register('courseName')}
          className="mt-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          disabled={isPending}
        />
        {errors.courseName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.courseName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="completionDate" className="text-slate-700 dark:text-slate-300">
          Completion Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="completionDate"
          type="date"
          {...register('completionDate')}
          className="mt-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          disabled={isPending}
        />
        {errors.completionDate && (
          <p className="mt-1 text-sm text-red-500">
            {errors.completionDate.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <Label className="text-slate-700 dark:text-slate-300">Issuer</Label>
        <div className="mt-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
          MSU TCTO
        </div>
      </div>

      {isError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <p className="text-sm text-red-700 dark:text-red-400">
            {error?.message || 'Failed to issue certificate. Please try again.'}
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
          'Issue Certificate'
        )}
      </Button>
    </form>
  );
}
