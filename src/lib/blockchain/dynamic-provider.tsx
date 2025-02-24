"use client"

import {
  DynamicContextProvider
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
// import { avalancheFuji, avalanche } from "viem/chains";
import { baseSepolia } from "viem/chains";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ReactNode } from "react";

const evmNetworks = [
  // Commenting out Avalanche networks for now
  /*{
    "blockExplorerUrls": ["https://snowtrace.io/"],
    "chainId": 43114,
    "chainName": "Avalanche Mainnet",
    "iconUrls": ["https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/info/logo.png"],
    "name": "Avalanche",
    "nativeCurrency": {
        "decimals": 18,
        "name": "Avalanche",
        "symbol": "AVAX",
        "iconUrl": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/info/logo.png"
    },
    "networkId": 43114,
    "rpcUrls": ["https://api.avax.network/ext/bc/C/rpc"],
    "vanityName": "Avalanche" 
  },
  {
    "blockExplorerUrls": ["https://testnet.snowtrace.io/"],
    "chainId": 43113,
    "chainName": "Avalanche Fuji Testnet",
    "iconUrls": ["https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/info/logo.png"],
    "name": "Avalanche Fuji",
    "nativeCurrency": {
        "decimals": 18,
        "name": "Avalanche",
        "symbol": "AVAX",
        "iconUrl": "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/info/logo.png"
    },
    "networkId": 43113,
    "rpcUrls": ["https://api.avax-test.network/ext/bc/C/rpc"],
    "vanityName": "Avalanche Fuji"
  }*/
  {
    "blockExplorerUrls": ["https://sepolia.basescan.org/"],
    "chainId": 84532,
    "chainName": "Base Sepolia",
    "iconUrls": ["https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Base_Network_Logo.svg"],
    "name": "Base Sepolia",
    "nativeCurrency": {
        "decimals": 18,
        "name": "Ether",
        "symbol": "ETH",
        "iconUrl": "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/Base_Network_Logo.svg"
    },
    "networkId": 84532,
    "rpcUrls": ["https://sepolia.base.org"],
    "vanityName": "Base Sepolia"
  }
];

const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

interface DynamicProviderProps {
  children: ReactNode;
}

export default function DynamicProvider({ children }: DynamicProviderProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "b37bff76-4d08-4b34-8494-3495c8fa65e5",
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
