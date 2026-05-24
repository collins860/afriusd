import Link from "next/link";
import { NavbarAuth } from "@/components/marketing/NavbarAuth";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AfriUSD</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</a>
            <a href="#benefits" className="text-sm text-gray-400 hover:text-white transition-colors">Benefits</a>
          </div>
          <NavbarAuth />
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Accept Stablecoin
            <br />
            <span className="gradient-text">Payments Across Africa</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create invoices in local currency and receive instant USDC settlement on Arc Network. Built for African freelancers, merchants, and businesses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all glow-emerald">
                Start Accepting Payments
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto border border-[#1e1e2e] hover:border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all">
                View Dashboard →
              </button>
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-6">No bank account required · Instant settlement · Zero borders</p>
        </div>

        {/* Hero Card Preview */}
        <div className="max-w-4xl mx-auto mt-20 relative">
          <div className="glass rounded-2xl p-6 border border-[#1e1e2e]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">$24,850.00</p>
                <p className="text-emerald-400 text-sm mt-1">+12.5% this month</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Network</p>
                <p className="text-white font-semibold mt-1">Arc Testnet</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-sm">Connected</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Paid Invoices", value: "48", color: "text-emerald-400" },
                { label: "Pending", value: "7", color: "text-yellow-400" },
                { label: "USDC Received", value: "24,850", color: "text-blue-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0a0a0f] rounded-xl p-4 border border-[#1e1e2e]">
                  <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to get paid</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">A complete invoicing and payment platform built for the African market</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "Smart Invoicing",
                desc: "Create professional invoices in NGN, KES, GHS, ZAR or USD. Automatic USDC conversion at live rates.",
              },
              {
                icon: "⚡",
                title: "Instant Settlement",
                desc: "Receive USDC payments directly to your wallet on Arc Network. No delays, no intermediaries.",
              },
              {
                icon: "🌍",
                title: "Global Reach",
                desc: "Share invoice links or QR codes with customers anywhere in the world. They pay with USDC.",
              },
              {
                icon: "🔐",
                title: "Wallet Native",
                desc: "Connect MetaMask or any WalletConnect-compatible wallet. Your keys, your money.",
              },
              {
                icon: "📊",
                title: "Payment Dashboard",
                desc: "Track all your invoices, payments, and revenue in one clean dashboard.",
              },
              {
                icon: "📱",
                title: "QR Code Payments",
                desc: "Every invoice gets a QR code. Perfect for in-person payments across Africa.",
              },
            ].map((feature) => (
              <div key={feature.title} className="glass rounded-xl p-6 border border-[#1e1e2e] hover:border-emerald-500/30 transition-all group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0d0d15]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400 text-lg">Get paid in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { step: "01", title: "Connect your wallet", desc: "Link your MetaMask or any Web3 wallet to AfriUSD in one click." },
              { step: "02", title: "Create an invoice", desc: "Fill in customer details, amount in your local currency, and due date." },
              { step: "03", title: "Share with customer", desc: "Send the invoice link or QR code to your customer anywhere in the world." },
              { step: "04", title: "Get paid in USDC", desc: "Customer pays with USDC on Arc Network. Funds arrive in your wallet instantly." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 p-6 glass rounded-xl border border-[#1e1e2e]">
                <div className="text-4xl font-bold text-emerald-500/30 font-mono">{item.step}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for African businesses</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Whether you're a freelancer in Lagos, a merchant in Nairobi, or a creator in Accra</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "No bank account needed", desc: "All you need is a crypto wallet. No KYC, no paperwork, no waiting." },
              { title: "Multiple local currencies", desc: "Invoice in NGN, KES, GHS, ZAR, or USD. We handle the USDC conversion." },
              { title: "Stable value payments", desc: "USDC doesn't fluctuate like crypto. 1 USDC = 1 USD, always." },
              { title: "Low transaction fees", desc: "Arc Network is built for fast, cheap transactions. Keep more of your money." },
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-4 p-6 glass rounded-xl border border-[#1e1e2e]">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-12 border border-[#1e1e2e] relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to get paid?</h2>
              <p className="text-gray-400 text-lg mb-8">Join African merchants already using AfriUSD to accept global payments.</p>
              <Link href="/signup">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all glow-emerald">
                  Launch App →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold">AfriUSD</span>
          </div>
          <p className="text-gray-500 text-sm">Built on Arc Network · Powered by Circle USDC</p>
          <p className="text-gray-600 text-sm">© 2025 AfriUSD. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}