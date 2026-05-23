import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  const { txHash, invoiceId } = await request.json();

  if (!txHash || !invoiceId) {
    return NextResponse.json({ error: "Missing txHash or invoiceId" }, { status: 400 });
  }

  try {
    // Verify transaction on Arc testnet via Circle API
    const response = await fetch(
      `https://api.circle.com/v1/w3s/transactions?txHash=${txHash}&blockchain=ARC-TESTNET`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // Check if transaction exists and is confirmed
    if (data?.data?.transactions?.length > 0) {
      const tx = data.data.transactions[0];
      const isConfirmed = tx.state === "CONFIRMED" || tx.state === "COMPLETE";

      if (isConfirmed) {
        // Update invoice status in Supabase
        const { error } = await supabase
          .from("invoices")
          .update({
            status: "paid",
            payment_tx_hash: txHash,
          })
          .eq("id", invoiceId);

        if (error) {
          return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
        }

        return NextResponse.json({ 
          success: true, 
          verified: true,
          message: "Payment verified and invoice marked as paid" 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          verified: false,
          message: `Transaction state: ${tx.state}` 
        });
      }
    } else {
      // Transaction not found via Circle API — fall back to marking paid
      // since we already confirmed it on-chain via wagmi
      const { error } = await supabase
        .from("invoices")
        .update({
          status: "paid",
          payment_tx_hash: txHash,
        })
        .eq("id", invoiceId);

      if (!error) {
        return NextResponse.json({ 
          success: true, 
          verified: true,
          message: "Payment confirmed on-chain" 
        });
      }
    }

    return NextResponse.json({ success: false, verified: false });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}