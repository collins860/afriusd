import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { markInvoicePaid } from "@/lib/invoices/db";

export async function POST(request: Request) {
  const { txHash, invoiceId } = await request.json();

  if (!txHash || !invoiceId) {
    return NextResponse.json({ error: "Missing txHash or invoiceId" }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  const admin = createAdminClient();

  try {
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

    if (data?.data?.transactions?.length > 0) {
      const tx = data.data.transactions[0];
      const isConfirmed = tx.state === "CONFIRMED" || tx.state === "COMPLETE";

      if (isConfirmed) {
        try {
          await markInvoicePaid(admin, invoiceId, txHash);
        } catch {
          return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          verified: true,
          message: "Payment verified and invoice marked as paid",
        });
      }

      return NextResponse.json({
        success: false,
        verified: false,
        message: `Transaction state: ${tx.state}`,
      });
    }

    try {
      await markInvoicePaid(admin, invoiceId, txHash);
      return NextResponse.json({
        success: true,
        verified: true,
        message: "Payment confirmed on-chain",
      });
    } catch {
      return NextResponse.json({ success: false, verified: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
