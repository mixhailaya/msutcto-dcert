export const CERTIFICATE_CONTRACT_ABI = [
  {
    type: 'function',
    name: 'issueCertificate',
    inputs: [
      { name: 'certificateId', type: 'string' },
      { name: 'recipientAddress', type: 'address' },
      { name: 'recipientName', type: 'string' },
      { name: 'courseName', type: 'string' },
      { name: 'completionDate', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'issueCertificateBatch',
    inputs: [
      {
        name: 'data',
        type: 'tuple[]',
        components: [
          { name: 'certificateId', type: 'string' },
          { name: 'recipientAddress', type: 'address' },
          { name: 'recipientName', type: 'string' },
          { name: 'courseName', type: 'string' },
          { name: 'completionDate', type: 'uint256' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'verifyCertificate',
    inputs: [{ name: 'certificateId', type: 'string' }],
    outputs: [
      { name: 'exists', type: 'bool' },
      { name: 'isValid', type: 'bool' },
      {
        name: 'certificate',
        type: 'tuple',
        components: [
          { name: 'certificateId', type: 'string' },
          { name: 'recipientAddress', type: 'address' },
          { name: 'recipientName', type: 'string' },
          { name: 'courseName', type: 'string' },
          { name: 'completionDate', type: 'uint256' },
          { name: 'isRevoked', type: 'bool' },
          { name: 'issuedAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCertificate',
    inputs: [{ name: 'certificateId', type: 'string' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'certificateId', type: 'string' },
          { name: 'recipientAddress', type: 'address' },
          { name: 'recipientName', type: 'string' },
          { name: 'courseName', type: 'string' },
          { name: 'completionDate', type: 'uint256' },
          { name: 'isRevoked', type: 'bool' },
          { name: 'issuedAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isCertificateValid',
    inputs: [{ name: 'certificateId', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isCertificateRevoked',
    inputs: [{ name: 'certificateId', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'revokeCertificate',
    inputs: [{ name: 'certificateId', type: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'authorizeIssuer',
    inputs: [{ name: 'issuer', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeIssuer',
    inputs: [{ name: 'issuer', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isAuthorizedIssuer',
    inputs: [{ name: 'issuer', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCertificateCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCertificatesByRange',
    inputs: [
      { name: 'start', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'certificateId', type: 'string' },
          { name: 'recipientAddress', type: 'address' },
          { name: 'recipientName', type: 'string' },
          { name: 'courseName', type: 'string' },
          { name: 'completionDate', type: 'uint256' },
          { name: 'isRevoked', type: 'bool' },
          { name: 'issuedAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllCertificateIds',
    inputs: [],
    outputs: [{ name: '', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRecentCertificates',
    inputs: [{ name: 'count', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'certificateId', type: 'string' },
          { name: 'recipientAddress', type: 'address' },
          { name: 'recipientName', type: 'string' },
          { name: 'courseName', type: 'string' },
          { name: 'completionDate', type: 'uint256' },
          { name: 'isRevoked', type: 'bool' },
          { name: 'issuedAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'CertificateIssued',
    inputs: [
      { name: 'certificateId', type: 'string', indexed: true },
      { name: 'recipientAddress', type: 'address', indexed: true },
      { name: 'recipientName', type: 'string', indexed: false },
      { name: 'courseName', type: 'string', indexed: false },
      { name: 'completionDate', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'CertificateRevoked',
    inputs: [
      { name: 'certificateId', type: 'string', indexed: true },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'IssuerAuthorized',
    inputs: [{ name: 'issuer', type: 'address', indexed: true }],
  },
  {
    type: 'event',
    name: 'IssuerRemoved',
    inputs: [{ name: 'issuer', type: 'address', indexed: true }],
  },
] as const;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

if (!CONTRACT_ADDRESS) {
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
}