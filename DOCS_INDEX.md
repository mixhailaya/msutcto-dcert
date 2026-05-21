# Documentation Index

Navigate the MSU TCTO Certificate System documentation.

## Getting Started (Start Here)

1. **[QUICKSTART.md](./QUICKSTART.md)** ⚡
   - 5-minute setup guide
   - Get WalletConnect Project ID
   - Deploy smart contract
   - Set environment variables
   - Run locally and test

2. **[README.md](./README.md)** 📖
   - Complete project overview
   - Tech stack and features
   - Project structure
   - Setup instructions
   - Deployment guides

## Implementation Details

3. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** 📋
   - What's been built
   - Architecture overview
   - Feature breakdown
   - File structure reference
   - Development tips

4. **[SMART_CONTRACT_INTERFACE.md](./SMART_CONTRACT_INTERFACE.md)** 🔗
   - Contract interface specification
   - Function signatures
   - Data structures
   - Event suggestions
   - Testing guide

5. **[API_HOOKS.md](./API_HOOKS.md)** 🎣
   - Custom blockchain hooks
   - Detailed API reference
   - Usage examples
   - Common patterns
   - Error handling

## Quick Navigation

### For Different Roles

**If you're a Frontend Developer:**
- Read: [QUICKSTART.md](./QUICKSTART.md) → [README.md](./README.md) → [API_HOOKS.md](./API_HOOKS.md)

**If you're a Smart Contract Developer:**
- Read: [QUICKSTART.md](./QUICKSTART.md) → [SMART_CONTRACT_INTERFACE.md](./SMART_CONTRACT_INTERFACE.md)

**If you're Managing the Project:**
- Read: [README.md](./README.md) → [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

**If you want to Deploy:**
- Read: [QUICKSTART.md](./QUICKSTART.md) → [README.md](./README.md) (Deployment section)

### By Topic

**Setting Up:**
- Environment variables: [QUICKSTART.md](./QUICKSTART.md) Step 2-3
- Smart contract: [QUICKSTART.md](./QUICKSTART.md) Step 2
- Running locally: [QUICKSTART.md](./QUICKSTART.md) Step 4

**Building Features:**
- Creating forms: [API_HOOKS.md](./API_HOOKS.md#pattern-1-form-with-validation)
- Using blockchain hooks: [API_HOOKS.md](./API_HOOKS.md)
- Project structure: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#file-structure-reference)

**Blockchain:**
- Contract interface: [SMART_CONTRACT_INTERFACE.md](./SMART_CONTRACT_INTERFACE.md)
- Hook API: [API_HOOKS.md](./API_HOOKS.md)
- Example contract: [QUICKSTART.md](./QUICKSTART.md#step-2-deploy-smart-contract)

**Deploying:**
- Production checklist: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#production-checklist)
- Vercel deployment: [README.md](./README.md#deployment) & [QUICKSTART.md](./QUICKSTART.md#deploy-to-vercel)

## File Structure

```
Project Root/
├── QUICKSTART.md                    ⚡ Start here (5 min setup)
├── README.md                        📖 Full documentation
├── PROJECT_SUMMARY.md               📋 What was built
├── SMART_CONTRACT_INTERFACE.md      🔗 Contract specs
├── API_HOOKS.md                     🎣 Hook reference
├── DOCS_INDEX.md                    👈 You are here
├── .env.example                     Environment template
├── app/
│   ├── page.tsx                     Landing page
│   ├── providers.tsx                Web3 setup
│   ├── verify/page.tsx              Certificate verification
│   └── admin/
│       ├── page.tsx                 Admin dashboard
│       └── layout.tsx               Admin auth protection
├── components/
│   ├── admin/                       Admin forms & tables
│   └── ui/                          shadcn/ui components
├── lib/
│   ├── wagmi.ts                     Blockchain config
│   ├── contract-abi.ts              Contract interface
│   └── hooks/
│       └── useBlockchainCertificates.ts  Custom hooks
└── package.json                     Dependencies
```

## Key Concepts

### Pages
- **`/`** - Landing page with hero and CTAs
- **`/verify`** - Public certificate verification (no auth)
- **`/admin`** - Protected admin dashboard

### Components
- **IssueCertificateForm** - Single certificate issuance
- **BatchIssueCertificatesForm** - Bulk certificate import
- **ManageCertificatesTable** - View and revoke certificates

### Custom Hooks
- `useVerifyCertificate()` - Read certificate data
- `useIssueCertificate()` - Issue single certificate
- `useBatchIssueCertificates()` - Issue multiple certificates
- `useRevokeCertificate()` - Revoke a certificate
- `useIsAuthorizedAdmin()` - Check admin status

## Common Tasks

### Task: Set up the project
1. Follow [QUICKSTART.md](./QUICKSTART.md)
2. Deploy contract (Step 2)
3. Configure `.env.local` (Step 3)
4. Run `pnpm dev` (Step 4)

### Task: Add a new certificate field
1. Update contract ABI in `lib/contract-abi.ts`
2. Update `useBlockchainCertificates.ts` hooks
3. Update form in `components/admin/IssueCertificateForm.tsx`
4. Test in `/admin` page

### Task: Deploy to production
1. Deploy contract to mainnet
2. Update `.env.production`
3. Run `pnpm build` locally (verify)
4. Push to GitHub and deploy via Vercel
5. Check [Production Checklist](./PROJECT_SUMMARY.md#production-checklist)

### Task: Support multiple networks
1. Edit `lib/wagmi.ts` and add chains
2. Test wallet switching
3. Update docs with new networks

## Resources

### Official Docs
- [Next.js](https://nextjs.org/docs)
- [wagmi](https://wagmi.sh)
- [RainbowKit](https://www.rainbowkit.com)
- [React Hook Form](https://react-hook-form.com)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Solidity](https://docs.soliditylang.org)

### Tools
- [Remix IDE](https://remix.ethereum.org) - Deploy contracts
- [Hardhat](https://hardhat.org) - Contract development
- [MetaMask](https://metamask.io) - Wallet
- [Vercel](https://vercel.com) - Hosting

### Testnet Resources
- [Polygon Mumbai](https://mumbai.polygonscan.com)
- [Ethereum Sepolia](https://sepolia.etherscan.io)
- [Faucets](https://faucetme.io) - Get testnet tokens

## Troubleshooting

### Can't connect wallet
1. Check browser console for errors
2. Make sure wallet is on correct network
3. Update network in MetaMask if needed (see [QUICKSTART.md](./QUICKSTART.md#network-setup-metamask-example))

### Contract calls failing
1. Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set
2. Check wallet authorization in contract
3. Ensure sufficient gas/MATIC balance
4. Check contract deployment at correct address

### Forms not submitting
1. Open browser DevTools → Console
2. Look for validation errors
3. Check gas estimation
4. Try Sepolia testnet (lower fees)

### Build errors
1. Run `pnpm install` to ensure dependencies
2. Check `tsconfig.json` is valid
3. Review error message carefully
4. Check for typos in imports

## Questions?

### About Setup
- See [QUICKSTART.md](./QUICKSTART.md) - 5 min guide
- See [README.md](./README.md) - Full setup details

### About Implementation
- See [API_HOOKS.md](./API_HOOKS.md) - Hook usage
- See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Architecture

### About Smart Contracts
- See [SMART_CONTRACT_INTERFACE.md](./SMART_CONTRACT_INTERFACE.md)
- Check [Solidity docs](https://docs.soliditylang.org)

### About Deployment
- See [README.md](./README.md#deployment)
- See [QUICKSTART.md](./QUICKSTART.md#deploy-to-vercel)

---

## Changelog

### Version 1.0 (Initial Release)
- ✅ Landing page with hero section
- ✅ Public certificate verification page
- ✅ Protected admin dashboard with wallet auth
- ✅ Single certificate issuance form
- ✅ Batch certificate import
- ✅ Certificate management table with revoke
- ✅ wagmi v2 + RainbowKit integration
- ✅ TanStack Query for data caching
- ✅ Form validation with React Hook Form + Zod
- ✅ Toast notifications with sonner
- ✅ Full TypeScript support
- ✅ Responsive design with Tailwind CSS
- ✅ Complete documentation

---

**Last Updated**: May 2026
**Status**: Production Ready ✨
