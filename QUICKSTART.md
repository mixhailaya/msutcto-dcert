# Quick Start Guide

Get the MSU TCTO Certificate System running in 5 minutes.

## Step 1: Get Your WalletConnect Project ID

1. Visit https://cloud.walletconnect.com
2. Sign up (free)
3. Create a new project
4. Copy your **Project ID**

## Step 2: Deploy Smart Contract

Use a tool like [Remix IDE](https://remix.ethereum.org) or [Hardhat](https://hardhat.org):

### Minimal Contract Example (Solidity)

```solidity
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string certificateId;
        string recipientName;
        string courseName;
        uint256 completionDate;
        address issuer;
        uint256 issuedDate;
        bool isRevoked;
    }

    mapping(string => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    
    constructor() {
        authorizedIssuers[msg.sender] = true;
    }

    function issueCertificate(
        string memory id,
        string memory recipient,
        string memory course,
        uint256 completionDate
    ) external {
        require(authorizedIssuers[msg.sender], "Not authorized");
        require(bytes(certificates[id].certificateId).length == 0, "Already exists");
        
        certificates[id] = Certificate({
            certificateId: id,
            recipientName: recipient,
            courseName: course,
            completionDate: completionDate,
            issuer: msg.sender,
            issuedDate: block.timestamp,
            isRevoked: false
        });
    }

    function verifyCertificate(string memory id) 
        external 
        view 
        returns (Certificate memory) 
    {
        return certificates[id];
    }

    function revokeCertificate(string memory id) external {
        require(authorizedIssuers[msg.sender], "Not authorized");
        certificates[id].isRevoked = true;
    }

    function isAuthorizedIssuer(address addr) 
        external 
        view 
        returns (bool) 
    {
        return authorizedIssuers[addr];
    }

    function issueCertificateBatch(
        Certificate[] calldata certs
    ) external {
        require(authorizedIssuers[msg.sender], "Not authorized");
        
        for (uint i = 0; i < certs.length; i++) {
            string memory id = certs[i].certificateId;
            require(bytes(certificates[id].certificateId).length == 0, "Exists");
            
            certificates[id] = Certificate({
                certificateId: certs[i].certificateId,
                recipientName: certs[i].recipientName,
                courseName: certs[i].courseName,
                completionDate: certs[i].completionDate,
                issuer: msg.sender,
                issuedDate: block.timestamp,
                isRevoked: false
            });
        }
    }
}
```

### Deploy Steps

1. Copy code above into Remix IDE (https://remix.ethereum.org)
2. Compile and deploy to **Polygon Mumbai Testnet** or **Ethereum Sepolia**
3. Save the contract address (e.g., `0x...`)

## Step 3: Configure Environment

```bash
cd /path/to/project

# Copy environment template
cp .env.example .env.local

# Edit .env.local
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

## Step 4: Run Locally

```bash
# Install dependencies (if not done)
pnpm install

# Start dev server
pnpm dev
```

Visit **http://localhost:3000**

## Step 5: Test It

### Test Public Verification
1. Go to http://localhost:3000/verify
2. Enter any certificate ID (e.g., "CERT-001")
3. Click "Verify"
4. You'll see mock data (will be real once connected to contract)

### Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Click "Connect Wallet"
3. Select MetaMask or another wallet
4. If your wallet is authorized in the contract, you'll see the dashboard
5. Try issuing a certificate or uploading a batch

## Network Setup (MetaMask Example)

To test on **Polygon Mumbai**:

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Fill in:
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Currency: `MATIC`
4. Save

Get free testnet tokens: https://faucet.polygon.technology

## Deploy to Vercel

```bash
# Login to Vercel
pnpm add -g vercel
vercel login

# Deploy
vercel --prod
```

Then add environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_PROJECT_ID`
- Add `NEXT_PUBLIC_CONTRACT_ADDRESS`

## Common Issues

### "Contract address not set"
- Check `.env.local` has `NEXT_PUBLIC_CONTRACT_ADDRESS`
- Make sure contract is deployed and address is correct

### "Wallet not authorized"
- Ensure your wallet address is in `authorizedIssuers` mapping in contract
- Call `authorizedIssuers[yourAddress] = true` in contract

### "Network mismatch"
- Make sure wallet is connected to same chain as deployed contract
- Update networks in `lib/wagmi.ts` if needed

### "Form not submitting"
- Check browser console for errors
- Ensure gas prices are reasonable
- Try Sepolia testnet (lower fees)

## Next Steps

1. ✅ Have your contract deployed
2. ✅ Set environment variables
3. ✅ Test the app locally
4. ✅ Deploy to Vercel
5. 🎉 Share with MSU TCTO!

## Get Help

- Check `README.md` for detailed docs
- See `SMART_CONTRACT_INTERFACE.md` for contract specs
- Review `PROJECT_SUMMARY.md` for architecture

## Testnet Resources

- **Polygon Mumbai Faucet**: https://faucet.polygon.technology
- **Ethereum Sepolia Faucet**: https://sepoliafaucet.com
- **Remix IDE**: https://remix.ethereum.org
- **MetaMask**: https://metamask.io

---

**You're all set! Start issuing certificates on the blockchain! 🚀**
