'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRevokeCertificate, useGetAllCertificatesBatch } from '@/lib/hooks/useBlockchainCertificates';
import { toast } from 'sonner';
import { Search, Trash2, Loader2 } from 'lucide-react';

export function ManageCertificatesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [revoking, setRevoking] = useState<string | null>(null);
  const { revokeCertificate, isPending: isRevoking } = useRevokeCertificate();
  const { data: certificates, isLoading, error, refetch } = useGetAllCertificatesBatch();
  console.log('Fetched certificates:', certificates);

  const filteredCertificates = useMemo(() => {
    if (!certificates || !Array.isArray(certificates)) return [];
    
    if (!searchTerm.trim()) return certificates;
    
    const searchLower = searchTerm.toLowerCase();
    
    return certificates.filter((cert) => {
      if (!cert) return false;
      
      const id = cert.id?.toLowerCase() || '';
      const recipient = cert.recipient?.toLowerCase() || '';
      const course = cert.course?.toLowerCase() || '';
      
      return id.includes(searchLower) || 
             recipient.includes(searchLower) || 
             course.includes(searchLower);
    });
  }, [certificates, searchTerm]);

  const handleRevoke = async (certificateId: string) => {
    if (!certificateId) return;
    
    if (
      confirm(
        `Are you sure you want to revoke certificate ${certificateId}? This cannot be undone.`
      )
    ) {
      setRevoking(certificateId);
      try {
        await revokeCertificate(certificateId);
        toast.success('Certificate revoked successfully');
        setTimeout(() => {
          refetch();
        }, 2000);
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
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-600 dark:text-slate-400">
            Loading certificates...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading certificates: {error.message || 'Failed to load certificates'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by ID, name, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Certificate ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Course
              </th>
              
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert, index) => (
                <tr
                  key={cert.id || index}
                  className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                >
                  <td className="px-4 py-4">
                    <code className="text-sm font-mono text-slate-900 dark:text-white">
                      {cert.id || 'N/A'}
                    </code>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-900 dark:text-white">
                    {cert.recipient || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {cert.course || 'N/A'}
                  </td>
                  
                  <td className="px-4 py-4">
                    <Badge
                      className={
                        cert.status === 'valid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50'
                      }
                    >
                      {cert.status === 'valid' ? 'Active' : 'Revoked'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {cert.status === 'valid' && cert.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRevoke(cert.id)}
                        disabled={isRevoking || revoking === cert.id}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
                      >
                        {revoking === cert.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Revoking...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Revoke
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-400">
                    {searchTerm ? 'No certificates match your search' : 'No certificates found'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4">
        Showing {filteredCertificates.length} of {certificates?.length || 0}{' '}
        certificates
      </div>
    </div>
  );
}