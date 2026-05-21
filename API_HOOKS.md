# Custom Blockchain Hooks API

All blockchain interactions are handled through custom hooks in `lib/hooks/useBlockchainCertificates.ts`.

## Overview

The hooks provide a simple interface to interact with the smart contract without dealing with wagmi/viem directly.

## Hooks Reference

### 1. useVerifyCertificate

**Purpose:** Read certificate data from the blockchain (public, no auth required)

**Location:** `lib/hooks/useBlockchainCertificates.ts`

**Usage:**
```typescript
import { useVerifyCertificate } from '@/lib/hooks/useBlockchainCertificates';

export function MyCertificateViewer() {
  const { certificate, isLoading, isError, error } = 
    useVerifyCertificate('CERT-001');

  if (isLoading) return <div>Searching...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!certificate) return <div>Not found</div>;

  return (
    <div>
      <p>Recipient: {certificate.recipientName}</p>
      <p>Course: {certificate.courseName}</p>
      <p>Status: {certificate.isRevoked ? 'Revoked' : 'Valid'}</p>
    </div>
  );
}
```

**Parameters:**
- `certificateId` (string): The certificate ID to look up (must be non-empty)

**Returns:**
```typescript
{
  certificate: Certificate | undefined,
  isLoading: boolean,
  isError: boolean,
  error: Error | null
}
```

**Certificate Type:**
```typescript
interface Certificate {
  certificateId: string;
  recipientName: string;
  courseName: string;
  completionDate: bigint;  // Unix timestamp
  issuer: string;          // Wallet address
  issuedDate: bigint;      // Unix timestamp
  isRevoked: boolean;
}
```

**Notes:**
- Automatically enabled/disabled based on `certificateId`
- Queries are cached by TanStack Query
- Works without wallet connection

---

### 2. useIssueCertificate

**Purpose:** Issue a single certificate (admin only, requires wallet connection & authorization)

**Location:** `lib/hooks/useBlockchainCertificates.ts`

**Usage:**
```typescript
import { useIssueCertificate } from '@/lib/hooks/useBlockchainCertificates';

export function IssueCertificateForm() {
  const { issueCertificate, isPending, isSuccess, isError, error } = 
    useIssueCertificate();

  const handleSubmit = (data: FormData) => {
    const timestamp = BigInt(
      Math.floor(new Date(data.completionDate).getTime() / 1000)
    );

    issueCertificate(
      data.certificateId,
      data.recipientName,
      data.courseName,
      timestamp
    );
  };

  if (isPending) return <div>Issuing certificate...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (isSuccess) return <div>Certificate issued!</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(formData);
    }}>
      {/* form fields */}
    </form>
  );
}
```

**Function Signature:**
```typescript
issueCertificate(
  certificateId: string,
  recipientName: string,
  courseName: string,
  completionDate: bigint  // Unix timestamp in seconds
): void
```

**Parameters:**
- `certificateId`: Unique identifier (e.g., "CERT-001")
- `recipientName`: Full name of recipient
- `courseName`: Name of training course
- `completionDate`: Unix timestamp (seconds) of when training was completed

**Returns:**
```typescript
{
  issueCertificate: (id, name, course, date) => void,
  isPending: boolean,     // Transaction in progress
  isSuccess: boolean,     // Transaction confirmed
  isError: boolean,       // Transaction failed
  error: Error | null
}
```

**Example - Convert Date String to Timestamp:**
```typescript
const dateString = "2024-01-15";
const timestamp = BigInt(
  Math.floor(new Date(dateString).getTime() / 1000)
);
// timestamp = 1705276800n
```

**Requirements:**
- Wallet must be connected
- Wallet must be authorized issuer
- Certificate ID must not already exist
- Contract must have gas

---

### 3. useBatchIssueCertificates

**Purpose:** Issue multiple certificates in one transaction

**Location:** `lib/hooks/useBlockchainCertificates.ts`

**Usage:**
```typescript
import { useBatchIssueCertificates } 
  from '@/lib/hooks/useBlockchainCertificates';

export function BatchImportForm() {
  const { batchIssueCertificates, isPending, isError } = 
    useBatchIssueCertificates();

  const handleImport = (jsonData: string) => {
    const parsed = JSON.parse(jsonData);
    
    const certificates = parsed.map((cert: any) => ({
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      courseName: cert.courseName,
      completionDate: BigInt(
        Math.floor(new Date(cert.completionDate).getTime() / 1000)
      ),
    }));

    batchIssueCertificates(certificates);
  };

  return (
    <textarea 
      onChange={(e) => handleImport(e.target.value)}
      placeholder="Paste JSON array..."
    />
  );
}
```

**Function Signature:**
```typescript
interface BatchCertificate {
  certificateId: string;
  recipientName: string;
  courseName: string;
  completionDate: bigint;
}

batchIssueCertificates(certificates: BatchCertificate[]): void
```

**JSON Format:**
```json
[
  {
    "certificateId": "CERT-001",
    "recipientName": "John Doe",
    "courseName": "Advanced Training",
    "completionDate": "2024-01-15"
  },
  {
    "certificateId": "CERT-002",
    "recipientName": "Jane Smith",
    "courseName": "Advanced Training",
    "completionDate": "2024-01-16"
  }
]
```

**Returns:**
```typescript
{
  batchIssueCertificates: (certs) => void,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
  error: Error | null
}
```

**Recommended Limits:**
- Maximum 100 certificates per batch (gas limits)
- Dates should be ISO format: "YYYY-MM-DD"

---

### 4. useRevokeCertificate

**Purpose:** Mark a certificate as revoked (admin only)

**Location:** `lib/hooks/useBlockchainCertificates.ts`

**Usage:**
```typescript
import { useRevokeCertificate } 
  from '@/lib/hooks/useBlockchainCertificates';

export function RevokeButton({ certificateId }: { certificateId: string }) {
  const { revokeCertificate, isPending } = useRevokeCertificate();

  const handleRevoke = () => {
    if (confirm('Confirm revocation?')) {
      revokeCertificate(certificateId);
    }
  };

  return (
    <button 
      onClick={handleRevoke} 
      disabled={isPending}
    >
      {isPending ? 'Revoking...' : 'Revoke'}
    </button>
  );
}
```

**Function Signature:**
```typescript
revokeCertificate(certificateId: string): void
```

**Parameters:**
- `certificateId`: ID of certificate to revoke

**Returns:**
```typescript
{
  revokeCertificate: (id) => void,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
  error: Error | null
}
```

**Requirements:**
- Wallet must be connected
- Wallet must be authorized issuer
- Certificate must exist
- Certificate must not already be revoked

---

### 5. useIsAuthorizedAdmin

**Purpose:** Check if connected wallet can issue certificates

**Location:** `lib/hooks/useBlockchainCertificates.ts`

**Usage:**
```typescript
import { useIsAuthorizedAdmin } 
  from '@/lib/hooks/useBlockchainCertificates';

export function AdminCheck() {
  const { isAuthorized, isLoading } = useIsAuthorizedAdmin();

  if (isLoading) return <div>Checking authorization...</div>;
  if (!isAuthorized) return <div>Not authorized</div>;

  return <div>You can issue certificates!</div>;
}
```

**Returns:**
```typescript
{
  isAuthorized: boolean | undefined,
  isLoading: boolean
}
```

**Notes:**
- Automatically queries when wallet connects
- Used in admin layout for access control
- Requires connected wallet

---

## Common Patterns

### Pattern 1: Form with Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useIssueCertificate } from '@/lib/hooks/useBlockchainCertificates';

const schema = z.object({
  certificateId: z.string().min(1),
  recipientName: z.string().min(2),
  courseName: z.string().min(2),
  completionDate: z.string(),
});

export function CertificateForm() {
  const { register, handleSubmit, formState: { errors } } = 
    useForm({ resolver: zodResolver(schema) });
  const { issueCertificate, isPending } = useIssueCertificate();

  const onSubmit = (data: z.infer<typeof schema>) => {
    const timestamp = BigInt(
      Math.floor(new Date(data.completionDate).getTime() / 1000)
    );

    issueCertificate(
      data.certificateId,
      data.recipientName,
      data.courseName,
      timestamp
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('certificateId')} />
      {errors.certificateId && <p>{errors.certificateId.message}</p>}
      
      {/* other fields */}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Issuing...' : 'Issue'}
      </button>
    </form>
  );
}
```

### Pattern 2: With Toast Notifications

```typescript
import { toast } from 'sonner';

function IssueCertificate() {
  const { issueCertificate, isError, isSuccess } = useIssueCertificate();

  const handleIssue = (data: FormData) => {
    issueCertificate(...);
  };

  // Watch for success
  useEffect(() => {
    if (isSuccess) {
      toast.success('Certificate issued!');
    }
  }, [isSuccess]);

  // Watch for errors
  useEffect(() => {
    if (isError) {
      toast.error('Failed to issue certificate');
    }
  }, [isError]);

  return <form onSubmit={handleIssue}>{/* ... */}</form>;
}
```

### Pattern 3: Conditional Rendering

```typescript
function AdminPage() {
  const { isAuthorized, isLoading } = useIsAuthorizedAdmin();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return <UnauthorizedMessage />;
  }

  return <AdminDashboard />;
}
```

---

## Error Handling

All hooks can throw errors from:
1. Network issues (RPC connection)
2. Contract validation (unauthorized, not found, etc.)
3. User rejection (wallet)
4. Gas estimation failures

**Example Error Handling:**
```typescript
const { certificate, isError, error } = useVerifyCertificate(id);

if (isError) {
  console.error('Verification failed:', error);
  // error.message = "Contract execution reverted: Certificate not found"
}
```

---

## Testing

### Mock Hook for Testing

```typescript
// __mocks__/useBlockchainCertificates.ts
export const useVerifyCertificate = jest.fn(() => ({
  certificate: { certificateId: 'CERT-001', /* ... */ },
  isLoading: false,
  isError: false,
  error: null,
}));
```

### Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { useVerifyCertificate } from '@/lib/hooks/useBlockchainCertificates';

jest.mock('@/lib/hooks/useBlockchainCertificates');

describe('CertificateViewer', () => {
  it('displays certificate data', () => {
    (useVerifyCertificate as jest.Mock).mockReturnValue({
      certificate: {
        certificateId: 'CERT-001',
        recipientName: 'John Doe',
        isRevoked: false,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<CertificateViewer certificateId="CERT-001" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

---

## TypeScript Support

All hooks are fully typed. Get intellisense in your editor:

```typescript
// Type is inferred automatically
const { certificate } = useVerifyCertificate('CERT-001');
//    ^ Certificate | undefined

// Function types
const { issueCertificate } = useIssueCertificate();
//       ^ (certificateId: string, recipientName: string, courseName: string, completionDate: bigint) => void
```

---

## Performance

- **Caching**: TanStack Query caches certificate lookups
- **Debouncing**: Consider debouncing rapid searches
- **Batch Operations**: Use batch issue for >1 certificates (cheaper gas)

---

**For questions or bugs, check the source: `lib/hooks/useBlockchainCertificates.ts`**
