"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits } from "viem";
import { arcTestnet, USDC_CONTRACT_ADDRESS, USDC_ABI, USDC_DECIMALS } from "@/lib/blockchain/config";
import { getWalletErrorMessage } from "@/lib/blockchain/errors";
import { ArcNetworkGuard } from "@/components/wallet/ArcNetworkGuard";
import { supabase } from "@/lib/supabase/client";
import { fetchInvoiceById } from "@/lib/invoices/db";
import type { Invoice } from "@/lib/invoices/types";
import { toast } from "sonner";

function isMobile() {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function MobileWalletButtons({ currentUrl }: { currentUrl: string }) {
  const encodedUrl = encodeURIComponent(currentUrl);

  const wallets = [
    {
      name: "MetaMask",
      icon: "🦊",
      deepLink: `https://metamask.app.link/dapp/${currentUrl.replace("https://", "")}`,
      color: "bg-orange-500",
    },
    {
      name: "OKX Wallet",
      icon: "⬛",
      deepLink: `okx://wallet/dapp/url?dappUrl=${encodedUrl}`,
      color: "bg-gray-800",
    },
    {
      name: "Trust Wallet",
      icon: "🛡️",
      deepLink: `trust://open_url?coin_id=60&url=${encodedUrl}`,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-center mb-4" style={{ color: "var(--text-secondary)" }}>
        Open in your wallet app to pay
      </p>
      {wallets.map((wallet) => (
        <a key={wallet.name} href={wallet.deepLink}
          className={`flex items-center gap-3 w-full ${wallet.color} text-white py-3 px-4 rounded-xl font-medium transition-opacity hover:opacity-90`}>
          <span className="text-xl">{wallet.icon}</span>
          <span>Open in {wallet.name}</span>
        </a>
      ))}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-muted)" }}>or</span>
        </div>
      </div>
      <div className="flex justify-center">
        <ConnectButton chainStatus="full" />
      </div>
    </div>
  );
}

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"view" | "paying" | "success">("view");
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const { address, isConnected, chainId } = useAccount();
  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({ hash: txHash, chainId: arcTestnet.id });
  const onArcNetwork = !isConnected || chainId === arcTestnet.id;

  useEffect(() => {
    setMobile(isMobile());
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    async function loadInvoice() {
      try { const data = await fetchInvoiceById(supabase, invoiceId); setInvoice(data); }
      catch { setInvoice(null); } finally { setLoading(false); }
    }
    loadInvoice();
  }, [invoiceId]);

  useEffect(() => {
    async function markPaid() {
      if (isSuccess && txHash && invoice && !paymentProcessed) {
        setPaymentProcessed(true);
        toast.loading("Verifying payment...");
        const response = await fetch("/api/verify-payment", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ txHash, invoiceId: invoice.id }),
        });
        const result = await response.json();
        if (response.ok && result.success) {
          toast.dismiss(); toast.success("Payment confirmed!");
          setInvoice((prev) => prev ? { ...prev, status: "paid", payment_tx_hash: txHash } : prev);
          setStep("success");
        } else {
          toast.dismiss(); toast.error(result.error || "Payment sent but invoice update failed.");
          setStep("view");
        }
      }
    }
    markPaid();
  }, [isSuccess, txHash, invoice, paymentProcessed]);

  useEffect(() => { if (writeError) { toast.error(getWalletErrorMessage(writeError)); setStep("view"); } }, [writeError]);
  useEffect(() => { if (confirmError) { toast.error(getWalletErrorMessage(confirmError)); setStep("view"); } }, [confirmError]);

  const handlePay = async () => {
    if (!isConnected) { toast.error("Please connect your wallet first"); return; }
    if (!onArcNetwork) { toast.error("Switch to Arc Testnet first"); return; }
    if (!invoice) return;
    setStep("paying");
    writeContract({ chainId: arcTestnet.id, address: USDC_CONTRACT_ADDRESS, abi: USDC_ABI, functionName: "transfer",
      args: [invoice.merchant_id as `0x${string}`, parseUnits(invoice.usdc_amount.toString(), USDC_DECIMALS)] });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)" }}>
      <p style={{ color: "var(--text-muted)" }}>Loading invoice...</p>
    </div>
  );

  if (!invoice) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="text-center">
        <p className="text-2xl font-bold mb-2">Invoice not found</p>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>The invoice {invoiceId} does not exist.</p>
        <Link href="/"><button className="bg-emerald-500 text-white px-6 py-3 rounded-xl">Go Home</button></Link>
      </div>
    </div>
  );

  if (step === "success") return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Your payment has been confirmed on Arc Network.</p>
        <div className="glass rounded-xl p-6 mb-6 text-left space-y-3">
          {[
            { label: "Invoice", value: invoice.id },
            { label: "Amount Paid", value: `${invoice.usdc_amount} USDC`, green: true },
            { label: "Network", value: "Arc Testnet" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
              <span className={`text-sm font-medium ${row.green ? "text-emerald-400" : ""}`}>{row.value}</span>
            </div>
          ))}
          <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Transaction Hash</p>
            <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
              className="text-emerald-400 text-xs font-mono truncate block hover:underline">{txHash}</a>
          </div>
        </div>
        <Link href="/dashboard">
          <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-medium transition-colors">Go to Dashboard</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      <header className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="font-semibold">AfriUSD</span>
        </div>
        <ConnectButton chainStatus="icon" showBalance={false} />
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Invoice Payment</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{invoice.id} · Due {invoice.due_date}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}`}>
            {invoice.status === "paid" ? "Paid" : "Awaiting Payment"}
          </span>
        </div>

        <div className="glass rounded-2xl overflow-hidden mb-6">
          <div className="p-6 border-b flex items-center gap-4" style={{ borderColor: "var(--border)" }}>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-bold text-lg">M</span>
            </div>
            <div>
              <p className="font-semibold">Merchant</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{invoice.merchant_id.slice(0, 10)}...{invoice.merchant_id.slice(-6)}</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Bill to</p>
              <p className="font-medium">{invoice.customer_name}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{invoice.customer_email}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Description</p>
              <p className="text-sm leading-relaxed">{invoice.description}</p>
            </div>
            <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Amount ({invoice.currency})</span>
                <span className="font-medium">{Number(invoice.amount).toLocaleString()} {invoice.currency}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Pay with USDC</span>
                <span className="text-2xl font-bold text-emerald-400">{invoice.usdc_amount} USDC</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.status === "paid" ? (
          <div className="glass rounded-xl border border-emerald-500/20 p-6 text-center">
            <p className="text-emerald-400 font-semibold text-lg mb-2">✓ This invoice has been paid</p>
            {invoice.payment_tx_hash && (
              <a href={`https://testnet.arcscan.app/tx/${invoice.payment_tx_hash}`} target="_blank" rel="noopener noreferrer"
                className="text-xs hover:text-emerald-400 transition-colors" style={{ color: "var(--text-muted)" }}>
                View transaction on ArcScan →
              </a>
            )}
            <Link href="/dashboard">
              <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-medium transition-colors">Go to Dashboard</button>
            </Link>
          </div>
        ) : !isConnected ? (
          <div className="glass rounded-xl border border-emerald-500/20 p-6">
            {mobile ? (
              <MobileWalletButtons currentUrl={currentUrl} />
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Connect your wallet to pay this invoice</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  You need Arc Testnet USDC from{" "}
                  <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">faucet.circle.com</a>
                </p>
                <div className="flex justify-center"><ConnectButton chainStatus="full" /></div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-xl border border-emerald-500/20 p-6 space-y-4">
            <ArcNetworkGuard />
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Wallet Connected</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{address}</p>
              </div>
            </div>
            <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
              {[
                { label: "You will pay", value: `${invoice.usdc_amount} USDC`, green: true },
                { label: "Network", value: "Arc Testnet", green: false },
                { label: "Gas fee", value: "~$0.001", green: true },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm mb-4">
                  <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                  <span className={row.green ? "text-emerald-400 font-bold" : ""}>{row.value}</span>
                </div>
              ))}
              <button onClick={handlePay} disabled={isPending || isConfirming || !onArcNetwork}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
                {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming on Arc..." : `Pay ${invoice.usdc_amount} USDC`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}