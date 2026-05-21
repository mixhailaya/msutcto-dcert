import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'MSU TCTO Certificate System',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project-id',
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  ssr: true,
});
