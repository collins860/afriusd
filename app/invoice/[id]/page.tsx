"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits } from "viem";
import { USDC_CONTRACT_ADDRESS, USDC_ABI } from "@/lib/blockchain/config";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

type Invoice = {
  id: string;
  merchant_id: string;
  customer_name: string;
  customer_email: string;
  description: string;
  amount: number;
  currency: string;
  usdc_amount: number;
  status: string;
  due_date: string;
  payment_tx_hash: string;
};

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"view" | "paying" | "success">("view");

  const { address, isConnected } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Load invoice from database
  useEffect(() => {
    async function fetchInvoice() {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId.toUpperCase())
        .single();

      if (!error && data) {
        setInvoice(data);
      } else {
        // Try lowercase too
        const { data: data2 } = await supabase
          .from("invoices")
          .select("*")
          .ilike("id", invoiceId)
          .single();
        if (data2) setInvoice(data2);
      }
      setLoading(false);
    }
    fetchInvoice();
  }, [invoiceId]);

  // Mark invoice as paid after successful transaction
  useEffect(() => {
    async function markPaid() {
  if (isSuccess && txHash && invoice) {
    toast.loading("Verifying payment...");

    // Call Circle API verification endpoint
    const response = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txHash,
        invoiceId: invoice.id,
      }),
    });

    const result = await response.json();

    if (result.success) {
      toast.dismiss();
      toast.success("Payment verified and confirmed!");
      setStep("success");
    } else {
      toast.dismiss();
      toast.error("Payment verification failed. Please contact support.");
    }
  }
}
    markPaid();
  }, [isSuccess, txHash, invoice]);

  const handlePay = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!invoice) return;

    try {
      setStep("paying");
      writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [
          invoice.merchant_id as `0x${string}`,
          parseUnits(invoice.usdc_amount.toString(), 6),
        ],
      });
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
      setStep("view");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">Invoice not found</p>
          <p className="text-gray-400 mb-6">The invoice {invoiceId} does not exist.</p>
          <Link href="/">
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl">Go Home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">Your payment has been confirmed on Arc Network.</p>
          <div className="glass rounded-xl border border-[#1e1e2e] p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Invoice</span>
              <span className="text-white text-sm font-medium">{invoice.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Amount Paid</span>
              <span className="text-emerald-400 text-sm font-bold">{invoice.usdc_amount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Network</span>
              <span className="text-white text-sm">Arc Testnet</span>
            </div>
            <div className="border-t border-[#1e1e2e] pt-3">
              <p className="text-gray-400 text-xs mb-1">Transaction Hash</p>
              
               <a href={`https://testnet.arcscan.app/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 text-xs font-mono truncate block hover:underline"
              >{txHash}</a>
            </div>
          </div>
          <Link href="/">
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-medium transition-colors">
              Return to AfriUSD
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="font-semibold">AfriUSD</span>
        </div>
        <ConnectButton />
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Invoice Payment</h1>
            <p className="text-gray-400 text-sm mt-1">{invoice.id} · Due {invoice.due_date}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            invoice.status === "paid"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}>
            {invoice.status === "paid" ? "Paid" : "Awaiting Payment"}
          </span>
        </div>

        <div className="glass rounded-2xl border border-[#1e1e2e] overflow-hidden mb-6">
          <div className="p-6 border-b border-[#1e1e2e] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-bold text-lg">M</span>
            </div>
            <div>
              <p className="font-semibold">Merchant</p>
              <p className="text-gray-400 text-sm">{invoice.merchant_id.slice(0, 10)}...{invoice.merchant_id.slice(-6)}</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Bill to</p>
              <p className="font-medium">{invoice.customer_name}</p>
              <p className="text-gray-400 text-sm">{invoice.customer_email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Description</p>
              <p className="text-sm leading-relaxed">{invoice.description}</p>
            </div>
            <div className="border-t border-[#1e1e2e] pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Amount ({invoice.currency})</span>
                <span className="font-medium">{Number(invoice.amount).toLocaleString()} {invoice.currency}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                <span className="text-gray-400 text-sm">Pay with USDC</span>
                <span className="text-2xl font-bold text-emerald-400">{invoice.usdc_amount} USDC</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.status === "paid" ? (
          <div className="glass rounded-xl border border-emerald-500/20 p-6 text-center">
            <p className="text-emerald-400 font-semibold text-lg mb-2">✓ This invoice has been paid</p>
            {invoice.payment_tx_hash && (
              <a
                href={`https://testnet.arcscan.app/tx/${invoice.payment_tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-emerald-400 transition-colors"
              >
                View transaction on ArcScan →
              </a>
            )}
          </div>
        ) : !isConnected ? (
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">Connect your wallet to pay this invoice</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="glass rounded-xl border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Wallet Connected</p>
                <p className="text-xs text-gray-400">{address}</p>
              </div>
            </div>
            <div className="border-t border-[#1e1e2e] pt-4">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-400">You will pay</span>
                <span className="font-bold text-emerald-400">{invoice.usdc_amount} USDC</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-400">Network</span>
                <span>Arc Testnet</span>
              </div>
              <div className="flex justify-between text-sm mb-6">
                <span className="text-gray-400">Gas fee</span>
                <span className="text-emerald-400">~$0.001</span>
              </div>
              <button
                onClick={handlePay}
                disabled={isPending || isConfirming}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors"
              >
                {isPending ? "Confirm in wallet..." : isConfirming ? "Confirming on Arc..." : `Pay ${invoice.usdc_amount} USDC`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}