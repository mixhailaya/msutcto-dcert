import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Quick Verification',
    description: 'Search a certificate ID and instantly confirm if the record exists and remains valid.',
  },
  {
    icon: Lock,
    title: 'Tamper-Resistant Records',
    description: 'Certificate references are recorded on-chain to help prevent silent alteration or fake claims.',
  },
  {
    icon: Zap,
    title: 'Real-Time Status',
    description: 'View active or revoked certificate status directly from the verification workflow.',
  },
];

const steps = [
  'MSU TCTO issues a digital certificate record.',
  'The record is stored through a blockchain transaction.',
  'Students or external verifiers check the certificate ID online.',
  'The system returns the official certificate status.',
];

const stats = [
  { label: 'Verification Flow', value: '4 Steps' },
  { label: 'Access', value: 'Public' },
  { label: 'Admin Control', value: 'Authorized' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg shadow-indigo-600/20">
        <CheckCircle2 className="h-5 w-5 text-white" />
      </div>

      <div className="leading-tight">
        <p className="text-base font-bold tracking-tight sm:text-lg">
          MSU TCTO
        </p>
        <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
          Certificate Verification System
        </p>
      </div>
    </Link>

    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
      <a
        href="#features"
        className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        Features
      </a>
      <a
        href="#process"
        className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        Process
      </a>
      <a
        href="#access"
        className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        Access
      </a>
    </nav>

    <Link href="/verify">
      <Button
        size="sm"
        className="bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Verify Now
      </Button>
    </Link>
  </div>
</header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Blockchain-backed certificate verification
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Verify MSU TCTO certificates with confidence and transparency.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                A responsive certificate verification platform for students, employers, training offices, and authorized administrators. It helps confirm certificate authenticity, issue new records, and manage certificate status through a blockchain-powered workflow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/verify" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-700 hover:to-blue-700 sm:w-auto">
                  Verify Certificate
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-slate-300 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70 sm:w-auto">
                  Admin Dashboard
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <Card key={item.label} className="border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="text-2xl font-bold text-slate-950 dark:text-white">{item.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden border-slate-200 bg-white/85 p-5 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sample Verification Result</p>
                  <h2 className="mt-1 text-2xl font-bold">Certificate Valid</h2>
                </div>
                <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Certificate ID</p>
                    <p className="mt-1 font-mono text-sm font-semibold">CERT-2026-001</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <BadgeCheck className="h-3 w-3" /> Active
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Recipient</p>
                    <p className="mt-1 text-sm font-semibold">Juan Dela Cruz</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Program</p>
                    <p className="mt-1 text-sm font-semibold">Blockchain Training</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <GraduationCap className="mb-2 h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-semibold">For Students</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <Users className="mb-2 h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-semibold">For Employers</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <FileCheck2 className="mb-2 h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-semibold">For Admins</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Core Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Designed for secure academic credential verification</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/50 dark:text-indigo-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="process" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white dark:border-slate-800">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">Verification Process</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A simple workflow from issuance to public validation.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  The platform separates public verification from administrator-only certificate issuance and revocation, making the system easier to use and maintain.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section id="access" className="mx-auto max-w-7xl px-4 py-12 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
              <h2 className="text-2xl font-bold">Public Verification</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Anyone with a certificate ID can verify the certificate without needing administrator privileges. This is suitable for students, agencies, and employers.
              </p>
              <Link href="/verify" className="mt-6 inline-block">
                <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                  Go to Verification
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
            <Card className="border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
              <h2 className="text-2xl font-bold">Authorized Admin Dashboard</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Authorized wallets can issue single certificates, process batch certificate records, and revoke certificates when needed.
              </p>
              <Link href="/admin" className="mt-6 inline-block">
                <Button variant="outline" className="gap-2 border-slate-300 dark:border-slate-700">
                  Open Admin Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 py-8 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 MSU TCTO Certificate Verification System. All rights reserved.</p>
          <p>Built for transparent academic credential verification.</p>
        </div>
      </footer>
    </div>
  );
}
