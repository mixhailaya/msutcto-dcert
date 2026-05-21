# Smart Contract Interface

This document describes the expected smart contract interface for the MSU TCTO Certificate System.

## Overview

The smart contract manages the lifecycle of training certificates:
- **Issuance**: Creating new certificates on-chain
- **Verification**: Reading certificate data
- **Revocation**: Marking certificates as revoked
- **Access Control**: Managing who can issue certificates

## Interface Specification

### Data Structure

```solidity
struct Certificate {
    string certificateId;        // Unique identifier (e.g., "CERT-001")
    string recipientName;        // Name of certificate holder
    string courseName;          // Name of training course
    uint256 completionDate;     // Unix timestamp of course completion
    address issuer;             // Address of issuing organization
    uint256 issuedDate;         // Unix timestamp of issuance
    bool isRevoked;             // Revocation status
}
```

## Functions

### Write Functions (State Changing)

#### `issueCertificate()`
Issues a single certificate.

**Signature:**
```solidity
function issueCertificate(
    string memory certificateId,
    string memory recipientName,
    string memory courseName,
    uint256 completionDate
) external returns (bool)
```

**Parameters:**
- `certificateId`: Unique identifier for the certificate
- `recipientName`: Full name of the certificate recipient
- `courseName`: Name of the training course
- `completionDate`: Unix timestamp when training was completed

**Returns:**
- `true` if successful, `false` otherwise

**Access Control:**
- Only authorized issuers (see `isAuthorizedIssuer()`)
- Reverts if certificate ID already exists

**Example:**
```solidity
uint256 completionDate = 1705276800; // 2024-01-15

issueCertificate(
    "CERT-001",
    "John Doe",
    "Advanced Training",
    completionDate
);
```

#### `issueCertificateBatch()`
Issues multiple certificates in a single transaction.

**Signature:**
```solidity
function issueCertificateBatch(
    Certificate[] calldata certificates
) external returns (bool)
```

**Parameters:**
- `certificates`: Array of Certificate objects to issue

**Returns:**
- `true` if all certificates issued successfully

**Access Control:**
- Only authorized issuers
- Reverts if any certificate ID already exists

**Example:**
```javascript
const certificates = [
    {
        certificateId: "CERT-001",
        recipientName: "John Doe",
        courseName: "Advanced Training",
        completionDate: 1705276800n
    },
    {
        certificateId: "CERT-002",
        recipientName: "Jane Smith",
        courseName: "Advanced Training",
        completionDate: 1705276800n
    }
];

await contract.write.issueCertificateBatch([certificates]);
```

#### `revokeCertificate()`
Marks a certificate as revoked.

**Signature:**
```solidity
function revokeCertificate(
    string memory certificateId
) external returns (bool)
```

**Parameters:**
- `certificateId`: ID of certificate to revoke

**Returns:**
- `true` if successful

**Access Control:**
- Only authorized issuers
- Reverts if certificate doesn't exist
- Reverts if already revoked

### Read Functions (View)

#### `verifyCertificate()`
Retrieves certificate data.

**Signature:**
```solidity
function verifyCertificate(
    string memory certificateId
) external view returns (Certificate memory)
```

**Parameters:**
- `certificateId`: ID of certificate to retrieve

**Returns:**
- Certificate struct with all data

**Access Control:**
- Public (no authentication required)

**Example Usage (JavaScript):**
```javascript
const certificate = await contract.read.verifyCertificate(['CERT-001']);

console.log(certificate.recipientName);  // "John Doe"
console.log(certificate.isRevoked);      // false
```

#### `isAuthorizedIssuer()`
Checks if an address can issue certificates.

**Signature:**
```solidity
function isAuthorizedIssuer(
    address issuerAddress
) external view returns (bool)
```

**Parameters:**
- `issuerAddress`: Wallet address to check

**Returns:**
- `true` if authorized, `false` otherwise

**Access Control:**
- Public

**Example:**
```javascript
const isAuthorized = await contract.read.isAuthorizedIssuer([
    "0x742d35Cc6634C0532925a3b844Bc9e7595f42e6d"
]);
```

## Integration with Frontend

### Using wagmi Hooks

The frontend provides custom hooks in `lib/hooks/useBlockchainCertificates.ts`:

```typescript
// Verify a certificate
const { certificate, isLoading } = useVerifyCertificate("CERT-001");

// Issue a certificate
const { issueCertificate, isPending } = useIssueCertificate();
issueCertificate("CERT-001", "John Doe", "Training", 1705276800n);

// Check admin status
const { isAuthorized } = useIsAuthorizedAdmin();

// Revoke a certificate
const { revokeCertificate } = useRevokeCertificate();
revokeCertificate("CERT-001");
```

## Contract ABI

The contract ABI is defined in `lib/contract-abi.ts`. Update this file if your contract interface differs.

## Network Compatibility

This system is designed to work on:
- Ethereum Mainnet & Sepolia Testnet
- Polygon Mainnet & Mumbai Testnet
- Any EVM-compatible chain

The networks are configured in `lib/wagmi.ts`. Add additional chains as needed.

## Event Suggestions

Consider emitting events for better indexing and notifications:

```solidity
event CertificateIssued(
    string indexed certificateId,
    address indexed recipient,
    uint256 timestamp
);

event CertificateRevoked(
    string indexed certificateId,
    uint256 timestamp
);
```

## Testing

### Local Testing with Hardhat

```solidity
// Deploy contract
const Certificate = await ethers.getContractFactory("CertificateRegistry");
const cert = await Certificate.deploy();

// Test issueCertificate
await cert.issueCertificate(
    "CERT-001",
    "Test User",
    "Test Course",
    Math.floor(Date.now() / 1000)
);

// Verify
const result = await cert.verifyCertificate("CERT-001");
console.log(result.recipientName); // "Test User"
```

## Security Considerations

1. **Access Control**: Ensure only authorized addresses can call `issueCertificate()`
2. **Input Validation**: Validate certificate IDs are non-empty
3. **Reentrancy**: Not applicable (no external calls)
4. **Gas Optimization**: Consider pagination for batch operations (max 100 per batch)
5. **Event Logging**: Emit events for off-chain indexing

## Migration Guide

If migrating from a previous contract:

1. Deploy new contract with updated interface
2. Add migration script to batch-issue certificates from old contract
3. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in environment
4. Update contract ABI in `lib/contract-abi.ts`
5. Verify all tests pass

## Support

For contract-specific questions:
- See Solidity docs: https://docs.soliditylang.org
- See OpenZeppelin docs: https://docs.openzeppelin.com
- Use Hardhat: https://hardhat.org
