'use client'

import React from 'react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { base, baseGoerli, localhost } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, argentWallet } from '@rainbow-me/rainbowkit/wallets';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [baseGoerli, base, { ...localhost, chainId: process.env.NEXT_PUBLIC_CHAIN_ID || 31337 }],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || "" }), publicProvider()],
)

const PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "";
const APP_NAME = "My App";

const { wallets } = getDefaultWallets({
    appName: APP_NAME,
    projectId: PROJECT_ID,
    chains
});

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [
            injectedWallet({ chains }),
            argentWallet({ projectId: PROJECT_ID, chains }),
        ],
    },
]);

const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
})

interface Web3ProviderProps {
    children: React.ReactNode
}

export default function Web3Provider({ children }: Web3ProviderProps) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains}>
                {mounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}