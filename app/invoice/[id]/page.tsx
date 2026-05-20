"use client";

import { useState } from "react";
import Link from "next/link";

const mockInvoice = {
  id: "INV-5860",
  merchant: "Emeka Designs",
  merchantAddress: "0x1234...5678",
  customer: "John Doe",
  customerEmail: "john@example.com",
  description: "Website design and development — 5 pages, mobile responsive, with CMS integration.",
  amount: "250,000",
  currency: "NGN",
  symbol: "₦",
  usdcAmount: "162.50",
  dueDate: "2025-06-01",
  status: "pending",
};

export default function InvoicePage() {
  const [step, setStep] = useState<"view" | "paying" | "success">("view");
  const [txHash] = useState("0xabc123def456789...");

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">Your payment has been confirmed on Arc Network.</p>

          <div className="glass rounded-xl border border-[#1e1e2e] p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Invoice</span>
              <span className="text-white text-sm font-medium">{mockInvoice.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Amount Paid</span>
              <span className="text-emerald-400 text-sm font-bold">{mockInvoice.usdcAmount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Network</span>
              <span className="text-white text-sm">Arc Testnet</span>
            </div>
            <div className="border-t border-[#1e1e2e] pt-3">
              <p className="text-gray-400 text-xs mb-1">Transaction Hash</p>
              <p className="text-emerald-400 text-xs font-mono truncate">{txHash}</p>
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
      {/* Header */}
      <header className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="font-semibold">AfriUSD</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-300">Arc Testnet</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Status Banner */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Invoice Payment</h1>
            <p className="text-gray-400 text-sm mt-1">{mockInvoice.id} · Due {mockInvoice.dueDate}</p>
          </div>
          <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs px-3 py-1.5 rounded-full font-medium">
            Awaiting Payment
          </span>
        </div>

        {/* Invoice Card */}
        <div className="glass rounded-2xl border border-[#1e1e2e] overflow-hidden mb-6">
          {/* Merchant Info */}
          <div className="p-6 border-b border-[#1e1e2e] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-bold text-lg">
                {mockInvoice.merchant.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold">{mockInvoice.merchant}</p>
              <p className="text-gray-400 text-sm">{mockInvoice.merchantAddress}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Bill to</p>
              <p className="font-medium">{mockInvoice.customer}</p>
              <p className="text-gray-400 text-sm">{mockInvoice.customerEmail}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Description</p>
              <p className="text-sm leading-relaxed">{mockInvoice.description}</p>
            </div>

            <div className="border-t border-[#1e1e2e] pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Amount ({mockInvoice.currency})</span>
                <span className="font-medium">{mockInvoice.symbol}{mockInvoice.amount}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                <span className="text-gray-400 text-sm">Pay with USDC</span>
                <span className="text-2xl font-bold text-emerald-400">{mockInvoice.usdcAmount} USDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="glass rounded-xl border border-[#1e1e2e] p-6 mb-6 text-center">
          <p className="text-gray-400 text-sm mb-4">Scan to pay on mobile</p>
          <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center">
            <div className="grid grid-cols-5 gap-0.5 p-2">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${
                    [0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24,7,12,17].includes(i)
                      ? "bg-black"
                      : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">afriusd.app/pay/{mockInvoice.id.toLowerCase()}</p>
        </div>

        {/* Payment Button */}
        {step === "view" && (
          <div className="space-y-3">
            <button
              onClick={() => setStep("paying")}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-semibold text-lg transition-all glow-emerald"
            >
              Connect Wallet to Pay
            </button>
            <p className="text-center text-gray-600 text-xs">
              Powered by Arc Network · Secured by USDC
            </p>
          </div>
        )}

        {step === "paying" && (
          <div className="glass rounded-xl border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Wallet Connected</p>
                <p className="text-xs text-gray-400">0x9876...4321</p>
              </div>
            </div>

            <div className="border-t border-[#1e1e2e] pt-4">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-400">You will pay</span>
                <span className="font-bold text-emerald-400">{mockInvoice.usdcAmount} USDC</span>
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
                onClick={() => setStep("success")}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Confirm Payment — {mockInvoice.usdcAmount} USDC
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}