"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/blockchain/config";
import { toast } from "sonner";

export function ArcNetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === arcTestnet.id) {
    return null;
  }

  return (
    <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
      <p className="text-sm text-yellow-200 font-medium mb-1">Wrong network</p>
      <p className="text-xs text-yellow-200/80 mb-3">
        MetaMask must be on <strong>Arc Testnet</strong> to pay. You are on chain{" "}
        {chainId}.
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          switchChain(
            { chainId: arcTestnet.id },
            {
              onError: (err) =>
                toast.error(
                  err.message.includes("4902")
                    ? "Add Arc Testnet in MetaMask when prompted, then try again."
                    : err.message
                ),
            }
          );
        }}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        {isPending ? "Switching..." : "Switch to Arc Testnet"}
      </button>
    </div>
  );
}
