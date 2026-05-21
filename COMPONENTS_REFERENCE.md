# Components Reference

Complete guide to all custom components in the MSU TCTO Certificate System.

## Pages

### `app/page.tsx` - Landing Page

**Purpose:** First page users see. Showcases system with hero section and CTAs.

**Key Features:**
- Header with logo and tagline
- Hero title with gradient text
- Three feature cards (Quick Verification, Secure & Immutable, Instant Results)
- Call-to-action buttons (Verify Certificate, Admin Login)
- Trust badge
- Footer

**Exports:** Default component

**Uses:**
- shadcn/ui components: Button, Card
- lucide-react icons: CheckCircle2, Search, Lock, Zap

**Size:** ~117 lines

---

### `app/verify/page.tsx` - Certificate Verification

**Purpose:** Public page for anyone to verify certificates without authentication.

**Key Features:**
- Certificate ID search input
- Real-time blockchain lookup
- Certificate detail display (if found)
- Status badge (Valid/Revoked)
- Error handling for not found
- Loading spinner
- Empty state on initial load

**Exports:** Default component (client component)

**Uses:**
- Custom hook: `useVerifyCertificate()`
- shadcn/ui components: Button, Card, Input, Badge
- lucide-react icons: ArrowLeft, CheckCircle2, Clock, AlertCircle
- sonner: toast notifications

**Size:** ~255 lines

**Flow:**
1. User enters certificate ID
2. Click "Verify" button
3. Hook queries blockchain
4. Display results or error

---

### `app/admin/page.tsx` - Admin Dashboard

**Purpose:** Main admin interface with three tabs for certificate management.

**Key Features:**
- Tab-based navigation (Issue, Batch, Manage)
- Each tab has dedicated functionality
- Clean dashboard layout

**Exports:** Default component

**Uses:**
- Components: IssueCertificateForm, BatchIssueCertificatesForm, ManageCertificatesTable
- shadcn/ui components: Tabs, Card

**Size:** ~72 lines

**Tabs:**
1. **Issue Certificate** - Single certificate form
2. **Batch Import** - Bulk JSON import
3. **Manage Certificates** - View and revoke

---

### `app/admin/layout.tsx` - Admin Layout with Auth

**Purpose:** Wrapper for admin pages with wallet connection and authorization checks.

**Key Features:**
- Checks if wallet is connected
- Verifies user is authorized issuer
- Shows appropriate UI state for each situation
- Header with back button and wallet status
- RainbowKit ConnectButton integration

**Exports:** Default component (client component)

**Uses:**
- Custom hook: `useIsAuthorizedAdmin()`
- wagmi hook: `useAccount()`
- RainbowKit: `ConnectButton`
- shadcn/ui components: Button, Card
- lucide-react icons: ArrowLeft, AlertCircle, CheckCircle2

**Size:** ~204 lines

**States:**
1. **Not Connected** - Show "Connect Wallet" prompt
2. **Checking** - Show loading spinner
3. **Unauthorized** - Show error message with address
4. **Authorized** - Show dashboard content

---

## Custom Components

### `components/admin/IssueCertificateForm.tsx` - Single Certificate Form

**Purpose:** Form to issue a single certificate with validation.

**Key Features:**
- Form validation with React Hook Form + Zod
- Fields: Certificate ID, Recipient Name, Course Name, Completion Date
- Read-only Issuer field (MSU TCTO)
- Submit button with loading state
- Error display for failed transactions
- Toast notifications for feedback

**Exports:** `IssueCertificateForm` component

**Props:** None

**Uses:**
- Custom hook: `useIssueCertificate()`
- React Hook Form: `useForm`, `register`
- Zod for schema validation
- shadcn/ui components: Button, Input, Label
- lucide-react icons: Loader2
- sonner: toast notifications

**Size:** ~175 lines

**Form Fields:**
```
Certificate ID*        [text input, min 3 chars]
Recipient Name*       [text input, min 2 chars]
Course Name*          [text input, min 2 chars]
Completion Date*      [date input]
Issuer               [read-only: "MSU TCTO"]
                     [Submit button]
```

---

### `components/admin/BatchIssueCertificatesForm.tsx` - Batch Import Form

**Purpose:** Import multiple certificates from JSON file.

**Key Features:**
- JSON textarea input
- Format validation
- Download template button (generates example JSON)
- Format requirements clearly displayed
- Batch size limits (≤100)
- Error handling with user-friendly messages

**Exports:** `BatchIssueCertificatesForm` component

**Props:** None

**Uses:**
- Custom hook: `useBatchIssueCertificates()`
- shadcn/ui components: Button, Label
- lucide-react icons: Loader2, Download
- sonner: toast notifications

**Size:** ~183 lines

**JSON Format:**
```json
[
  {
    "certificateId": "CERT-001",
    "recipientName": "John Doe",
    "courseName": "Advanced Training",
    "completionDate": "2024-01-15"
  }
]
```

**Features:**
- Template download generates sample JSON
- Validates JSON structure
- Validates required fields
- Supports up to 100 certificates
- Converts dates to Unix timestamps

---

### `components/admin/ManageCertificatesTable.tsx` - Certificate Table

**Purpose:** Display list of issued certificates with management actions.

**Key Features:**
- Searchable table by ID, name, or course
- Columns: ID, Recipient, Course, Issue Date, Status, Actions
- Status badges (Active/Revoked)
- Revoke button for active certificates
- Revocation confirmation dialog
- Responsive scrolling
- Certificate count display

**Exports:** `ManageCertificatesTable` component

**Props:** None

**Uses:**
- Custom hook: `useRevokeCertificate()`
- shadcn/ui components: Button, Input, Badge
- lucide-react icons: Search, Trash2, Loader2
- sonner: toast notifications

**Size:** ~192 lines

**Columns:**
| Certificate ID | Recipient | Course | Issue Date | Status | Actions |
|---|---|---|---|---|---|
| CERT-001 | John Doe | Training | 2024-01-15 | Active | Revoke |
| CERT-002 | Jane Smith | Training | 2024-01-16 | Revoked | - |

**Notes:**
- Uses mock data (replace with real blockchain queries)
- Search filters all columns
- Revoke button shows confirmation
- Loading state during revocation

---

### `app/providers.tsx` - Web3 Provider Wrapper

**Purpose:** Sets up all Web3 infrastructure (wagmi, RainbowKit, TanStack Query).

**Key Features:**
- WagmiProvider setup
- RainbowKit integration
- TanStack Query configuration
- sonner Toaster setup
- RainbowKit styles import

**Exports:** `Providers` component (client component)

**Props:**
```typescript
{
  children: ReactNode
}
```

**Uses:**
- wagmi: `WagmiProvider`
- RainbowKit: `RainbowKitProvider`
- TanStack Query: `QueryClientProvider`, `QueryClient`
- sonner: `Toaster`

**Size:** ~25 lines

**Position:** Wraps entire app in `app/layout.tsx`

---

## Layout & Layout Wrapper

### `app/layout.tsx` - Root Layout

**Purpose:** Main layout for entire application. Sets up metadata, fonts, providers, and background.

**Key Features:**
- Metadata (title, description, icons)
- Viewport configuration (theme color, scaling)
- Web3 providers setup
- Global gradient background
- Analytics integration

**Exports:** Default component (Server Component)

**Size:** ~50 lines

---

## Utility Components from shadcn/ui

The project includes all standard shadcn/ui components:

- `Button` - Interactive buttons with variants
- `Card` - Container cards with rounded corners
- `Input` - Text input fields
- `Label` - Form labels
- `Tabs` - Tabbed interfaces
- `Badge` - Status badges
- And 50+ others (see `components/ui/`)

See [shadcn/ui docs](https://ui.shadcn.com) for usage.

---

## Custom Hooks

### `lib/hooks/useBlockchainCertificates.ts`

**Exports:**
1. `useVerifyCertificate(certificateId)` - Read certificate
2. `useIssueCertificate()` - Issue single certificate
3. `useBatchIssueCertificates()` - Issue multiple certificates
4. `useRevokeCertificate()` - Revoke a certificate
5. `useIsAuthorizedAdmin()` - Check admin status

See [API_HOOKS.md](./API_HOOKS.md) for detailed reference.

---

## Configuration Files

### `lib/wagmi.ts` - Blockchain Configuration

**Exports:** `wagmiConfig` object

**Configures:**
- RainbowKit app name and project ID
- Supported networks (Ethereum mainnet/Sepolia, Polygon mainnet/Mumbai)
- SSR mode enabled

---

### `lib/contract-abi.ts` - Smart Contract ABI

**Exports:**
- `CERTIFICATE_CONTRACT_ABI` - Function definitions
- `CONTRACT_ADDRESS` - Contract address (from env)

**ABI Functions:**
- `issueCertificate()`
- `issueCertificateBatch()`
- `verifyCertificate()`
- `revokeCertificate()`
- `isAuthorizedIssuer()`

---

## Component Tree

```
<html>
  <body>
    <Providers>
      <RainbowKitProvider>
        <WagmiProvider>
          <QueryClientProvider>
            <Layout>
              {/* Routes */}
              <Routes>
                <Route path="/" component={LandingPage} />
                <Route path="/verify" component={VerifyPage} />
                <Route path="/admin" component={AdminLayout}>
                  <AdminPage>
                    <IssueCertificateForm />
                    <BatchIssueCertificatesForm />
                    <ManageCertificatesTable />
                  </AdminPage>
                </Route>
              </Routes>
            </Layout>
            <Toaster />
          </QueryClientProvider>
        </WagmiProvider>
      </RainbowKitProvider>
    </Providers>
  </body>
</html>
```

---

## Component Import Reference

Quick copy-paste imports:

```typescript
// Pages
import LandingPage from '@/app/page';
import VerifyPage from '@/app/verify/page';
import AdminPage from '@/app/admin/page';
import AdminLayout from '@/app/admin/layout';
import { Providers } from '@/app/providers';

// Admin Components
import { IssueCertificateForm } from '@/components/admin/IssueCertificateForm';
import { BatchIssueCertificatesForm } from '@/components/admin/BatchIssueCertificatesForm';
import { ManageCertificatesTable } from '@/components/admin/ManageCertificatesTable';

// Hooks
import { useVerifyCertificate } from '@/lib/hooks/useBlockchainCertificates';
import { useIssueCertificate } from '@/lib/hooks/useBlockchainCertificates';
import { useBatchIssueCertificates } from '@/lib/hooks/useBlockchainCertificates';
import { useRevokeCertificate } from '@/lib/hooks/useBlockchainCertificates';
import { useIsAuthorizedAdmin } from '@/lib/hooks/useBlockchainCertificates';

// shadcn/ui
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// External
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
```

---

## Styling Reference

All components use Tailwind CSS with these patterns:

**Colors:**
- Primary: `from-indigo-600 to-blue-600`
- Text: `text-slate-900 dark:text-white`
- Border: `border-slate-300 dark:border-slate-700`
- Background: `bg-white dark:bg-slate-900`

**Spacing:**
- Cards: `p-6 sm:p-8`
- Gap: `gap-4` or `gap-6`
- Padding: `py-8 px-4`

**Shadows:**
- `shadow-sm` for subtle depth
- No shadow for minimal look

**Responsive:**
- `sm:` for tablets
- `md:` for larger screens
- Mobile-first approach

---

**See also:**
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Architecture overview
- [API_HOOKS.md](./API_HOOKS.md) - Detailed hook reference
- [QUICKSTART.md](./QUICKSTART.md) - Setup guide
