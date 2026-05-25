export function getWalletErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Transaction failed. Please try again.";
  }

  const e = error as { shortMessage?: string; message?: string; code?: number };
  const text = (e.shortMessage || e.message || "").toLowerCase();

  if (text.includes("user rejected") || text.includes("user denied")) {
    return "Transaction cancelled in MetaMask.";
  }
  if (text.includes("insufficient funds")) {
    return "Not enough USDC for gas or payment. Get testnet USDC from faucet.circle.com.";
  }
  if (text.includes("chain") || text.includes("network")) {
    return "Switch MetaMask to Arc Testnet and try again.";
  }
  if (e.code === 4902 || text.includes("unrecognized chain")) {
    return "Add Arc Testnet to MetaMask using the button above.";
  }

  return e.shortMessage || e.message || "Transaction failed. Please try again.";
}
