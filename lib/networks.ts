import { getFullnodeUrl } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  mainnet: {
    url: getFullnodeUrl('mainnet'),
    variables: {
      explorerUrl: 'https://suiscan.xyz/mainnet',
    },
  },
  testnet: {
    url: getFullnodeUrl('testnet'),
    variables: {
      explorerUrl: 'https://suiscan.xyz/testnet',
    },
  },
});

export { networkConfig, useNetworkVariable, useNetworkVariables };
