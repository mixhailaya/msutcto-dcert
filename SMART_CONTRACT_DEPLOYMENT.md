# Smart Contract Deployment Guide

This guide walks you through deploying the MSU TCTO Certificate contract to a blockchain network.

## Prerequisites

- MetaMask wallet installed
- Test ETH on your chosen network (or real ETH for mainnet)
- Access to Remix IDE (https://remix.ethereum.org)

## Supported Networks

The contract works on any EVM-compatible network:

- **Ethereum Sepolia** (Testnet) - Recommended for testing
- **Ethereum Mainnet** - For production
- **Polygon Mumbai** (Testnet) - Fast & cheap testing
- **Polygon Mainnet** - Fast & cheap production
- **Arbitrum One** - Low-cost alternative
- **Optimism** - Layer 2 solution

## Step 1: Get Test ETH (If Using Testnet)

### Sepolia Testnet Faucets:
- https://sepoliafaucet.com
- https://www.alchemy.com/faucets/ethereum-sepolia

### Polygon Mumbai Faucets:
- https://faucet.polygon.technology
- https://www.alchemy.com/faucets/polygon-mumbai

## Step 2: Deploy on Remix IDE

1. **Open Remix IDE**
   - Go to https://remix.ethereum.org

2. **Create a New File**
   - Click "Create new file"
   - Name it `MSUTCTOCertificate.sol`

3. **Copy Contract Code**
   - Copy the entire contract from `contracts/MSUTCTOCertificate.sol` in this project
   - Paste it into Remix

4. **Install OpenZeppelin Dependencies**
   - In the Remix file explorer, create a remappings.txt file
   - Add: `@openzeppelin/=https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/`
   - Or use npm remapping in your IDE settings

5. **Compile the Contract**
   - Go to "Solidity Compiler" tab (left sidebar)
   - Select compiler version `0.8.20`
   - Click "Compile MSUTCTOCertificate.sol"
   - Verify no errors appear

6. **Deploy the Contract**
   - Go to "Deploy & run transactions" tab
   - Set "Environment" to "Injected Web3" (connects to MetaMask)
   - Connect MetaMask to the desired network
   - Select contract "MSUTCTOCertificate"
   - Click "Deploy"
   - Approve the transaction in MetaMask

7. **Copy Contract Address**
   - After deployment, the contract address appears in the Remix console
   - Format: `0x...` (42 characters)
   - Save this address - you'll need it next

## Step 3: Authorize Admin Wallets

After deployment, the contract owner can authorize admin wallets to issue certificates:

### Via Remix IDE:

1. In the "Deploy & run transactions" tab
2. Under "Deployed Contracts", expand your contract
3. Find the `authorizeIssuer` function
4. Paste the admin wallet address you want to authorize
5. Click "transact" and approve in MetaMask

### Via Direct Transaction:

If using ethers.js or web3.js:

```javascript
const contract = new ethers.Contract(
  contractAddress,
  CERTIFICATE_CONTRACT_ABI,
  signer // must be contract owner
);

// Authorize an issuer
await contract.authorizeIssuer('0xYourAdminAddress');
```

## Step 4: Configure Your UI

1. **Create `.env.local` File**
   - In your Next.js project root, create `.env.local`

2. **Add Environment Variables**
   ```
   NEXT_PUBLIC_PROJECT_ID=your-wallet-connect-project-id
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
   ```

3. **Get WalletConnect Project ID**
   - Go to https://cloud.walletconnect.com
   - Create free account
   - Create new project
   - Copy Project ID
   - Paste into `.env.local`

## Step 5: Test the Integration

### Test Verification (No Auth Required)

1. Go to http://localhost:3000/verify
2. Enter a certificate ID (use test data)
3. Click "Verify"
4. Should show certificate details if it exists

### Test Admin Functions (Requires Wallet)

1. Go to http://localhost:3000/admin
2. Click "Connect Wallet"
3. Select MetaMask (or other wallet)
4. Make sure wallet is on the correct network
5. Approve connection in wallet popup
6. If authorized, you'll see the admin dashboard

### Issue a Test Certificate

1. Fill in the form:
   - Certificate ID: `TEST-001`
   - Recipient Address: `0x...` (your address or test address)
   - Recipient Name: `Test User`
   - Course Name: `Test Course`
   - Completion Date: Today's date

2. Click "Issue Certificate"
3. Approve transaction in MetaMask
4. Wait for confirmation
5. See success toast message

### Verify the Issued Certificate

1. Go to http://localhost:3000/verify
2. Enter `TEST-001`
3. Should show the certificate details you just created

## Common Issues & Troubleshooting

### 1. "Contract not found" Error

**Problem:** Remix says the contract can't be found.

**Solution:**
- Make sure you're using compiler version 0.8.20
- Check for syntax errors (marked in red)
- Clear browser cache and reload Remix

### 2. "Insufficient funds" Error

**Problem:** MetaMask shows insufficient funds for gas.

**Solution:**
- Get more test ETH from a faucet (see Step 1)
- On testnet, gas is usually very cheap
- Check your wallet balance in MetaMask

### 3. "Network mismatch" Error in UI

**Problem:** UI shows network mismatch between wallet and contract.

**Solution:**
- Make sure MetaMask is on the same network as your contract
- Contract deployed on Sepolia? Switch MetaMask to Sepolia
- Reload the browser page after switching networks

### 4. "Unauthorized" on Admin Dashboard

**Problem:** Connected wallet isn't authorized to issue certificates.

**Solution:**
- Use the contract owner wallet to authorize the wallet
- In Remix, call `authorizeIssuer(0xWalletAddress)`
- Wait for transaction to confirm
- Reload the dashboard

### 5. Certificate Search Returns Empty

**Problem:** Verify page doesn't find certificates you issued.

**Solution:**
- Make sure you're on the correct network
- Double-check the certificate ID (case-sensitive)
- Wait a few blocks for transaction to finalize
- Check contract address in `.env.local` matches deployed contract

## Contract Functions Reference

### Public Functions

#### `issueCertificate(certificateId, recipientAddress, recipientName, courseName, completionDate)`
- Issues a single certificate
- Only authorized issuers can call
- Emits `CertificateIssued` event

#### `issueCertificateBatch(data[])`
- Issues multiple certificates in one transaction
- `data` is array of certificate info
- More gas-efficient than multiple single calls
- Only authorized issuers can call

#### `verifyCertificate(certificateId)`
- Read-only function
- Returns certificate data and validity status
- Anyone can call (no gas cost)

#### `revokeCertificate(certificateId)`
- Marks certificate as revoked
- Only authorized issuers can call
- Cannot revoke already revoked certificates

#### `authorizeIssuer(issuer)`
- Adds a wallet as authorized issuer
- Only contract owner can call
- Event emitted on authorization

#### `isAuthorizedIssuer(issuer)`
- Checks if wallet is authorized issuer
- Read-only function
- Returns boolean

## Advanced: Direct Smart Contract Interaction

### Using Ethers.js v6

```javascript
import { ethers } from 'ethers';
import { CERTIFICATE_CONTRACT_ABI } from '@/lib/contract-abi';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const contract = new ethers.Contract(
  NEXT_PUBLIC_CONTRACT_ADDRESS,
  CERTIFICATE_CONTRACT_ABI,
  signer
);

// Issue certificate
const tx = await contract.issueCertificate(
  'CERT-001',
  '0x742d35Cc6634C0532925a3b844Bc855e7d4D5f10',
  'John Doe',
  'Advanced Training',
  Math.floor(Date.now() / 1000)
);

await tx.wait(); // Wait for transaction
console.log('Certificate issued!');
```

### Using Web3.js

```javascript
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(
  CERTIFICATE_CONTRACT_ABI,
  NEXT_PUBLIC_CONTRACT_ADDRESS
);

const accounts = await web3.eth.requestAccounts();
await contract.methods.issueCertificate(
  'CERT-001',
  '0x742d35Cc6634C0532925a3b844Bc855e7d4D5f10',
  'John Doe',
  'Advanced Training',
  Math.floor(Date.now() / 1000)
).send({ from: accounts[0] });
```

## Verifying Contract on Block Explorer

After deployment, you can verify your contract on the blockchain:

### Etherscan (Ethereum & Sepolia)

1. Go to https://etherscan.io (mainnet) or https://sepolia.etherscan.io (testnet)
2. Search for your contract address
3. Click "Verify and Publish"
4. Paste the contract code
5. Select compiler version 0.8.20
6. Submit for verification

This makes the contract code public and allows anyone to read it.

## Security Considerations

**Before going to production:**

1. **Audit the Contract** - Have security professionals review the code
2. **Test Extensively** - Test all functions on testnet first
3. **Use Hardware Wallets** - For admin wallet, use hardware wallet like Ledger
4. **Limit Admin Access** - Only authorize trusted issuers
5. **Monitor Events** - Watch for unauthorized certificate issuance
6. **Backup Keys** - Safely backup all private keys
7. **Use Rate Limiting** - In production, add rate limiting to UI

## Production Deployment Checklist

- [ ] Contract deployed on mainnet
- [ ] Admin wallets authorized
- [ ] Contract address in `.env.local` (production)
- [ ] WalletConnect Project ID configured
- [ ] UI tested on production network
- [ ] Verify page working
- [ ] Admin dashboard authorized
- [ ] Certificate issuance tested
- [ ] Certificate verification tested
- [ ] Error handling tested
- [ ] Mobile responsiveness verified
- [ ] Contract code verified on block explorer

## Getting Help

If you encounter issues:

1. Check the **TROUBLESHOOTING.md** file
2. Read the contract code comments in `contracts/MSUTCTOCertificate.sol`
3. Review Solidity docs: https://docs.soliditylang.org
4. Check Remix IDE documentation: https://remix-ide.readthedocs.io
5. Ask in Ethereum developer communities (Reddit, Discord, Forums)

## Next Steps

1. Deploy contract to Sepolia testnet
2. Authorize your admin wallet
3. Configure `.env.local` with contract address
4. Test the complete flow: Issue → Verify
5. When ready, deploy to mainnet
6. Deploy your UI to Vercel
7. Share verification link with your users!
