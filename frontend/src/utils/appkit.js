import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia } from "@reown/appkit/networks";

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
export const networks = [sepolia];

export const wagmiAdapter = projectId
  ? new WagmiAdapter({ networks, projectId })
  : null;

if (wagmiAdapter) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    defaultNetwork: sepolia,
    projectId,
    metadata: {
      name: "Smart Wallet",
      description: "ERC-4337 smart accounts",
      url: window.location.origin,
      icons: [`${window.location.origin}/favicon.svg`],
    },
    themeMode: "light",
    themeVariables: {
      "--apkt-accent": "#7c3aed",
      "--apkt-color-mix": "#7c3aed",
      "--apkt-color-mix-strength": 12,
      "--apkt-border-radius-master": "12px",
    },
    enableMobileFullScreen: true,
    features: { analytics: false },
  });
}
