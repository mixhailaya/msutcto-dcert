'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { IssueCertificateForm } from '@/components/admin/IssueCertificateForm';
import { BatchIssueCertificatesForm } from '@/components/admin/BatchIssueCertificatesForm';
import { ManageCertificatesTable } from '@/components/admin/ManageCertificatesTable';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('issue');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Certificate Management
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Issue, batch import, and manage training certificates on the blockchain
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg mb-8">
          <TabsTrigger
            value="issue"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
          >
            Issue Certificate
          </TabsTrigger>
          <TabsTrigger
            value="batch"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
          >
            Batch Import
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
          >
            Manage Certificates
          </TabsTrigger>
        </TabsList>

        {/* Issue Certificate Tab */}
        <TabsContent value="issue" className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <IssueCertificateForm />
          </Card>
        </TabsContent>

        {/* Batch Import Tab */}
        <TabsContent value="batch" className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <BatchIssueCertificatesForm />
          </Card>
        </TabsContent>

        {/* Manage Certificates Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <ManageCertificatesTable />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
