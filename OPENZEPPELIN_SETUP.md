# OpenZeppelin Dependencies Setup

The MSU TCTO Certificate contract uses OpenZeppelin's audited smart contract libraries. This guide shows how to set up the dependencies.

## What OpenZeppelin Provides

We use these OpenZeppelin contracts for security and standard compliance:

- **ERC20** - Token standard implementation
- **ERC20Burnable** - Token burning capability
- **Ownable** - Owner access control
- **Pausable** - Pause/unpause functionality

These are battle-tested, audited contracts used by thousands of projects.

## Option 1: Deploy on Remix IDE (Easiest)

Remix automatically handles OpenZeppelin imports, so no setup needed:

1. Open https://remix.ethereum.org
2. Create file `MSUTCTOCertificate.sol`
3. Copy contract code from `contracts/MSUTCTOCertificate.sol`
4. Remix automatically resolves imports
5. Click Compile - it will download dependencies

**No action required!** Remix handles everything.

## Option 2: Hardhat Project Setup

If you want to use Hardhat for local development:

### 1. Install Hardhat

```bash
npm install -D hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

### 2. Install OpenZeppelin Contracts

```bash
npm install @openzeppelin/contracts
```

### 3. Create Contract File

```bash
# Create contracts directory
mkdir contracts

# Copy the contract
cp contracts/MSUTCTOCertificate.sol contracts/
```

### 4. Update Hardhat Config

Edit `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon: {
      url: `https://polygon-rpc.com`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### 5. Create Deploy Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying MSUTCTOCertificate...");

  const Certificate = await hre.ethers.getContractFactory("MSUTCTOCertificate");
  const certificate = await Certificate.deploy();

  await certificate.deployed();

  console.log("Certificate deployed to:", certificate.address);

  // Save address to .env
  console.log(`\nAdd to .env.local:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${certificate.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 6. Deploy

```bash
# Set your private key
export PRIVATE_KEY=0x...

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

## Option 3: Truffle Project Setup

If you prefer Truffle over Hardhat:

### 1. Install Truffle

```bash
npm install -g truffle
truffle init
```

### 2. Install OpenZeppelin

```bash
npm install @openzeppelin/contracts
```

### 3. Create Contract

```bash
cp contracts/MSUTCTOCertificate.sol contracts/
```

### 4. Configure Truffle

Edit `truffle-config.js` for your networks:

```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 1000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
```

### 5. Deploy

```bash
truffle migrate --network sepolia
```

## Option 4: Foundry (Advanced)

For advanced developers using Foundry:

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Create Project

```bash
forge init my-cert-project
cd my-cert-project
```

### 3. Add OpenZeppelin

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### 4. Copy Contract

```bash
cp contracts/MSUTCTOCertificate.sol src/
```

### 5. Update Remappings

Create `foundry.toml`:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

remappings = [
    "@openzeppelin/=lib/openzeppelin-contracts/",
]
```

### 6. Build & Test

```bash
# Compile
forge build

# Test
forge test

# Deploy
forge create src/MSUTCTOCertificate.sol:MSUTCTOCertificate \
  --rpc-url https://sepolia.rpc.infura.io/v3/YOUR-PROJECT-ID \
  --private-key YOUR_PRIVATE_KEY
```

## Dependency Verification

To verify OpenZeppelin is properly installed:

### Remix IDE
- Check imports resolve (no red errors)
- Compile completes successfully

### Hardhat/Truffle
```bash
# Check installed packages
npm list @openzeppelin/contracts

# Should show something like:
# @openzeppelin/contracts@4.9.3
```

### Check Contract Size

Some networks have contract size limits. Check if your contract is too large:

```bash
# Hardhat
npx hardhat compile
# Check output for contract size

# Foundry
forge build --sizes
```

If contract is >24KB, you may need to optimize or split into smaller contracts.

## Import Alternatives

If you want to use different versions of OpenZeppelin:

### Use Older Version (4.8.3)

```solidity
import "@openzeppelin/contracts@4.8.3/token/ERC20/ERC20.sol";
```

### Use npm Imports (instead of GitHub)

Edit `hardhat.config.js`:

```javascript
module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
  },
};
```

Then in your contract, imports work automatically with npm packages.

## Troubleshooting

### "Cannot find @openzeppelin" Error

**In Remix:**
- Clear cache: Ctrl+Shift+Delete
- Reload page
- Try recompiling

**In Hardhat/Truffle:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Version Mismatch

Make sure your Solidity version matches:
- Contract: `pragma solidity ^0.8.20;`
- Config: `solidity: "0.8.20"`
- Compiler: Set to 0.8.20 in Remix

### Gas Limit Exceeded

The contract uses `ERC20` which has reasonable gas costs. If you hit limits:

1. Check your gas estimation is correct
2. Ensure you're on a network with sufficient gas available
3. Try increasing gasPrice in config

### Import Not Resolving

In Remix, if imports don't resolve:

1. Click File Explorer
2. Create `remappings.txt` with:
   ```
   @openzeppelin/=https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/
   ```
3. Recompile

## Security Notes

- OpenZeppelin contracts are audited and secure
- Always use the version specified (4.9.3)
- Don't modify OpenZeppelin code
- Keep your project dependencies updated regularly
- Monitor OpenZeppelin security announcements

## Learning Resources

- OpenZeppelin Docs: https://docs.openzeppelin.com/contracts/4.x/
- ERC20 Standard: https://eips.ethereum.org/EIPS/eip-20
- Contract Upgrades: https://docs.openzeppelin.com/contracts/4.x/upgradeable
- Security Best Practices: https://docs.openzeppelin.com/contracts/4.x/security-contact

## Next Steps

1. Choose your deployment method (Remix is easiest)
2. Install OpenZeppelin dependencies
3. Copy the contract
4. Compile successfully
5. Deploy to testnet
6. Test thoroughly
7. Deploy to mainnet when ready

**Recommendation:** Start with Remix IDE - it's the fastest way to get your contract live!
