"use client";

import { WagmiProvider, http, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
  Wallet,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  okxWallet,
  phantomWallet,
  zerionWallet,
  bybitWallet,
  bitgetWallet,
  uniswapWallet,
  safeWallet,
  rabbyWallet,
  braveWallet,
  imTokenWallet,
  oneInchWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { arcTestnet } from "./config";
import "@rainbow-me/rainbowkit/styles.css";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "1c78f2b6187f738cd6a7db007432b41d";

const appUrl = "https://afriusd.vercel.app";

// Custom wallet with mobile deep link
function createMobileWallet({
  id,
  name,
  iconUrl,
  iconBackground,
  deepLink,
  universalLink,
}: {
  id: string;
  name: string;
  iconUrl: string;
  iconBackground: string;
  deepLink: string;
  universalLink?: string;
}): Wallet {
  return {
    id,
    name,
    iconUrl,
    iconBackground,
    downloadUrls: {},
    mobile: {
      getUri: (uri: string) => {
        const encoded = encodeURIComponent(uri);
        return deepLink.replace("{uri}", encoded);
      },
    },
    qrCode: {
      getUri: (uri: string) => uri,
    },
    ...(universalLink && {
      desktop: {
        getUri: (uri: string) => {
          const encoded = encodeURIComponent(uri);
          return `${universalLink}?uri=${encoded}`;
        },
      },
    }),
    createConnector: metaMaskWallet.createConnector,
  };
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        okxWallet,
        trustWallet,
        coinbaseWallet,
        bybitWallet,
        bitgetWallet,
      ],
    },
    {
      groupName: "More Wallets",
      wallets: [
        rainbowWallet,
        phantomWallet,
        zerionWallet,
        uniswapWallet,
        rabbyWallet,
        braveWallet,
        imTokenWallet,
        oneInchWallet,
        safeWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "AfriUSD",
    projectId,
    appUrl,
  }
);

const config = createConfig({
  chains: [arcTestnet],
  connectors,
  ssr: true,
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={arcTestnet}
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#10b981",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}