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
      {
        success: false,
        error:
          "Server missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel environment variables.",
      },
      { status: 500 }
    );
  }

  const admin = createAdminClient();

  // Circle API is optional — wallet already confirmed the tx on Arc.
  let circleVerified = false;
  if (process.env.CIRCLE_API_KEY) {
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
      const tx = data?.data?.transactions?.[0];
      if (tx) {
        circleVerified =
          tx.state === "CONFIRMED" || tx.state === "COMPLETE";
      }
    } catch (error) {
      console.warn("Circle verification skipped:", error);
    }
  }

  try {
    await markInvoicePaid(admin, invoiceId, txHash);
    return NextResponse.json({
      success: true,
      verified: circleVerified,
      message: "Payment recorded",
    });
  } catch (error) {
    console.error("markInvoicePaid failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Could not update invoice in database",
      },
      { status: 500 }
    );
  }
}
