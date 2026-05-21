# 🚀 START HERE - MSU TCTO Certificate System

**Welcome!** Your complete Web3 certificate verification system is ready. Follow this guide to get started in 5 minutes.

## What You Have

✅ **Smart Contract** - Full-featured Solidity ERC20 contract  
✅ **Web3 UI** - Complete Next.js/React application  
✅ **Blockchain Integration** - wagmi v2, viem, RainbowKit  
✅ **Documentation** - 10+ comprehensive guides  
✅ **Ready to Deploy** - All code tested and verified

## 5-Minute Quick Start

### Step 1: Deploy Smart Contract (15 min)

1. Open **Remix IDE**: https://remix.ethereum.org
2. Create new file: `MSUTCTOCertificate.sol`
3. Copy code from: `contracts/MSUTCTOCertificate.sol`
4. Compile with version: **0.8.20**
5. Deploy to **Sepolia Testnet**
6. **Save the contract address** (you'll need this next)

👉 **Detailed guide:** See `SMART_CONTRACT_DEPLOYMENT.md`

### Step 2: Configure Environment (2 min)

1. In project root, create `.env.local` file
2. Add these two lines:

```
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

**How to get Project ID:**
- Visit: https://cloud.walletconnect.com
- Create free account
- Create new project
- Copy the Project ID

### Step 3: Run Locally (2 min)

```bash
pnpm dev
```

Visit: http://localhost:3000

### Step 4: Test Everything (5 min)

1. **Landing Page** (`/`)
   - Click "Verify Certificate" → Goes to `/verify`
   - Click "Admin Login" → Goes to `/admin`

2. **Verification Page** (`/verify`)
   - No wallet needed
   - Try searching for a certificate ID
   - (You'll see "not found" until you issue one)

3. **Admin Dashboard** (`/admin`)
   - Click "Connect Wallet"
   - Select MetaMask
   - Make sure wallet is on Sepolia testnet
   - Approve connection

4. **Issue Test Certificate**
   - Fill in the form:
     - Certificate ID: `CERT-001`
     - Recipient Address: Your wallet address (get from MetaMask)
     - Recipient Name: `Test User`
     - Course Name: `Test Course`
     - Completion Date: Today
   - Click "Issue Certificate"
   - Approve transaction in MetaMask
   - Wait for success toast

5. **Verify Your Certificate**
   - Go to `/verify`
   - Enter: `CERT-001`
   - Click "Verify"
   - See your certificate details!

**Congratulations! 🎉 Your system is working!**

## Next Steps

### For More Details

📖 **Read These (in order):**

1. `QUICKSTART.md` - Detailed 5-minute setup
2. `README.md` - Full project documentation
3. `SMART_CONTRACT_DEPLOYMENT.md` - Deployment guide
4. `API_HOOKS.md` - How to use the blockchain hooks
5. `TROUBLESHOOTING.md` - Common issues & fixes

### To Deploy to Production

1. Deploy contract to **Ethereum Mainnet** or **Polygon Mainnet**
2. Update `.env.local` with mainnet contract address
3. Deploy to **Vercel**: `vercel --prod`
4. Set environment variables in Vercel dashboard
5. Share with users!

### File Guide

| File | Purpose |
|------|---------|
| `contracts/MSUTCTOCertificate.sol` | Smart contract source code |
| `app/page.tsx` | Landing page |
| `app/verify/page.tsx` | Public verification page |
| `app/admin/page.tsx` | Admin dashboard |
| `lib/wagmi.ts` | Blockchain configuration |
| `lib/contract-abi.ts` | Contract interface |
| `lib/hooks/useBlockchainCertificates.ts` | Custom hooks |

### Key Pages

| Route | Purpose | Auth Required |
|-------|---------|--------------|
| `/` | Home page with CTAs | No |
| `/verify` | Verify certificates | No |
| `/admin` | Manage certificates | Yes (wallet) |

## Architecture Overview

```
User Flow:
├─ Public User (No Auth)
│  └─ /verify → Search certificate → See details
│
└─ Admin (Wallet Auth)
   └─ /admin → Connect wallet → Issue certificates
              → Batch import → Revoke certificates
```

## Smart Contract Basics

### What It Does

✅ Issues certificates (single & batch)  
✅ Stores data immutably on blockchain  
✅ Verifies certificates instantly  
✅ Allows revocation  
✅ Controls admin access  

### Key Functions

**Issue a certificate:**
```typescript
issueCertificate(
  "CERT-001",
  "0x742d35Cc6634C0532925a3b844Bc855e7d4D5f10",
  "John Doe",
  "Advanced Training",
  Math.floor(Date.now() / 1000)
);
```

**Verify a certificate:**
```typescript
const result = verifyCertificate("CERT-001");
// Returns: { exists, isValid, certificate }
```

**Revoke a certificate:**
```typescript
revokeCertificate("CERT-001");
```

## Technology Stack

**Smart Contract:**
- Solidity 0.8.20
- OpenZeppelin libraries
- ERC20 token standard

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- TailwindCSS

**Blockchain:**
- wagmi v2 (React hooks)
- viem (contract interactions)
- RainbowKit (wallet connection)
- TanStack Query (data caching)

## Important Notes

### Security
- ✅ Only authorized wallets can issue certificates
- ✅ Certificates stored immutably
- ✅ Public can verify without wallet
- ✅ Admin controls authorization

### Gas Costs
- **Sepolia/Mumbai:** Free (test networks)
- **Mainnet:** ~$5-20 per transaction
- **Verification:** Free (read-only)

### Networks Supported
- Ethereum Sepolia (recommended for testing)
- Polygon Mumbai (faster & cheaper testing)
- Ethereum Mainnet
- Polygon Mainnet

## Troubleshooting

**"Contract not found" error?**
- Make sure you deployed to the correct network
- Check contract address in `.env.local`
- Verify Solidity version is 0.8.20

**"Unauthorized Admin" on dashboard?**
- Make sure your wallet address is authorized
- Only contract owner can authorize issuers
- Use Remix to call `authorizeIssuer(yourAddress)`

**"Certificate not found" on verify?**
- Make sure transaction was confirmed on blockchain
- Double-check certificate ID (case-sensitive)
- Try refreshing the page

👉 **Full troubleshooting:** See `TROUBLESHOOTING.md`

## Common Tasks

### Issue a Single Certificate
1. Go to `/admin`
2. Connect wallet
3. Fill form → Click "Issue Certificate"
4. Approve in MetaMask
5. See success toast

### Batch Import Certificates
1. Go to `/admin` → "Batch Issue" tab
2. Click "Download Template" to see format
3. Prepare your CSV/JSON data
4. Paste JSON into box
5. Click "Submit Batch"
6. Approve transaction

### Manage Certificates
1. Go to `/admin` → "Manage Certificates" tab
2. See all issued certificates
3. Click "Revoke" to revoke any certificate
4. Approve transaction

### Verify Any Certificate
1. Go to `/verify`
2. Enter certificate ID
3. Click "Verify"
4. See certificate details (if valid)
5. See "Revoked" status if applicable

## Next: Read These Documents

1. **`QUICKSTART.md`** ← Start here for detailed setup
2. **`SMART_CONTRACT_DEPLOYMENT.md`** ← Detailed deploy steps
3. **`API_HOOKS.md`** ← Learn the blockchain hooks
4. **`TROUBLESHOOTING.md`** ← Fix common issues

## Support

**Questions about:**
- Smart contract? See `SMART_CONTRACT_INTERFACE.md`
- Hooks? See `API_HOOKS.md`
- Components? See `COMPONENTS_REFERENCE.md`
- Deployment? See `SMART_CONTRACT_DEPLOYMENT.md`
- Issues? See `TROUBLESHOOTING.md`

**Official Docs:**
- wagmi: https://wagmi.sh
- RainbowKit: https://www.rainbowkit.com
- Viem: https://viem.sh
- Solidity: https://docs.soliditylang.org

## Success Checklist

- [ ] Contract deployed to Sepolia
- [ ] `.env.local` configured
- [ ] `pnpm dev` running locally
- [ ] Landing page loads
- [ ] Verify page works
- [ ] Admin page shows wallet connection
- [ ] Can issue test certificate
- [ ] Can verify test certificate
- [ ] Ready to deploy to Vercel

## You're Ready! 🎉

Everything is set up and ready to go. Your blockchain certificate system is production-ready.

**Next step:** Read `QUICKSTART.md` for detailed instructions, or jump straight to deploying your smart contract on Remix IDE!

**Questions?** Check the documentation files or see `TROUBLESHOOTING.md`

---

**Project Status:** ✅ Complete & Integrated  
**Version:** 1.0.0  
**Created:** May 20, 2026
