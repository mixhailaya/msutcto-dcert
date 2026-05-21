# MSU TCTO Certificate Verification & Issuance System

A blockchain-backed certificate verification system built with Next.js, wagmi, and Web3 technologies. This full-stack dApp allows admins to issue training certificates on-chain and enables anyone to verify them without blockchain knowledge.

## Features

### Public Verification (No Auth Required)
- Search and verify certificates by ID
- View certificate details (recipient, course, dates, status)
- Real-time blockchain verification
- Mobile-friendly interface

### Admin Dashboard (Wallet-Based Access Control)
- Connect wallet via RainbowKit
- Issue single certificates
- Batch import certificates from JSON
- Manage issued certificates
- Revoke certificates

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Blockchain**: wagmi v2, viem, RainbowKit
- **State Management**: TanStack Query, React Hook Form
- **Styling**: Tailwind CSS, shadcn/ui
- **Notifications**: sonner
- **Validation**: Zod

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout with Web3 providers
│   ├── page.tsx                   # Landing page
│   ├── providers.tsx              # Web3 provider wrapper
│   ├── verify/
│   │   └── page.tsx              # Public verification page
│   └── admin/
│       ├── layout.tsx            # Admin layout with auth checks
│       └── page.tsx              # Admin dashboard
├── components/
│   ├── ui/                        # shadcn/ui components
│   └── admin/
│       ├── IssueCertificateForm.tsx       # Single certificate form
│       ├── BatchIssueCertificatesForm.tsx # Batch import form
│       └── ManageCertificatesTable.tsx    # Certificate list & revoke
├── lib/
│   ├── wagmi.ts                   # wagmi configuration
│   ├── contract-abi.ts            # Smart contract ABI
│   └── hooks/
│       └── useBlockchainCertificates.ts # Blockchain interaction hooks
└── public/                         # Static assets
```

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
# RainbowKit / wagmi
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

**Get a WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com
2. Create a free account
3. Create a new project and copy the Project ID

### 3. Deploy Smart Contract

Deploy the certificate contract to your chosen network (Ethereum Sepolia, Polygon, etc.):

```solidity
// Example contract interface (implement based on your needs)
interface ICertificateRegistry {
    function issueCertificate(
        string certificateId,
        string recipientName,
        string courseName,
        uint256 completionDate
    ) external;

    function verifyCertificate(
        string certificateId
    ) external view returns (...);

    function revokeCertificate(string certificateId) external;
    function isAuthorizedIssuer(address) external view returns (bool);
}
```

### 4. Configure Admin Access

Update your smart contract to set authorized issuer addresses:

```solidity
// Only MSU TCTO admin wallets can issue certificates
authorizedIssuers[0x...] = true;
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Pages Overview

### / (Landing Page)
- Hero section with project description
- CTA buttons for verification and admin login
- Feature highlights

### /verify (Public Verification)
- Search input for certificate ID
- Real-time blockchain lookup
- Display certificate details if found
- Shows status (Valid/Revoked/Not Found)
- No authentication required

### /admin (Protected Admin Dashboard)
- Wallet connection required via RainbowKit
- Access control: only authorized wallets can proceed
- Three tabs:
  1. **Issue Certificate**: Form to issue single certificates
  2. **Batch Import**: JSON-based bulk certificate issuance
  3. **Manage Certificates**: Table with revoke functionality

## Blockchain Hooks

Located in `lib/hooks/useBlockchainCertificates.ts`:

- `useVerifyCertificate(certificateId)` - Read certificate data
- `useIssueCertificate()` - Write single certificate
- `useBatchIssueCertificates()` - Write multiple certificates
- `useRevokeCertificate()` - Revoke a certificate
- `useIsAuthorizedAdmin()` - Check admin status

## Component Architecture

### Admin Forms
- Built with React Hook Form + Zod validation
- Auto-convert date inputs to blockchain timestamps
- Display loading/error states during transaction
- Toast notifications for user feedback

### Admin Table
- Mock data example (replace with real blockchain queries)
- Searchable by ID, name, or course
- Revoke action with confirmation
- Responsive design

## Styling

- **Color Scheme**: Blue/Indigo primary with slate neutrals
- **Theme**: Modern SaaS dashboard style
- **Responsive**: Mobile-first design
- **Dark Mode**: Built-in dark mode support via Tailwind

## Security Notes

- ✅ Wallet-based access control (no passwords)
- ✅ All writes secured by smart contract authorization
- ✅ RLS/blockchain verification for all reads
- ✅ No sensitive data stored client-side
- ⚠️ Smart contract must properly implement `isAuthorizedIssuer()`
- ⚠️ Always verify contract deployment before using in production

## Future Enhancements

- [ ] Real blockchain data fetching (replace mock data)
- [ ] Certificate download/print functionality
- [ ] Email notifications for issued certificates
- [ ] Leaderboard/certificate gallery
- [ ] QR code generation for certificates
- [ ] Multi-language support
- [ ] Analytics dashboard for admins

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

Then set environment variables in Vercel project settings.

## Support

For issues or questions:
1. Check the [Next.js docs](https://nextjs.org/docs)
2. Review [wagmi documentation](https://wagmi.sh)
3. Check [RainbowKit guides](https://www.rainbowkit.com)

## License

MIT
