import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { customerEmail, customerName, merchantName, invoiceId, amount, currency, usdcAmount, dueDate, description } = await request.json();

  try {
    await resend.emails.send({
      from: "AfriUSD <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Invoice ${invoiceId} — Payment Request from ${merchantName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:system-ui,-apple-system,sans-serif;">
            <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
              
              <!-- Header -->
              <div style="display:flex;align-items:center;margin-bottom:32px;">
                <div style="width:36px;height:36px;background:#10b981;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;margin-right:12px;">
                  <span style="color:white;font-weight:bold;font-size:16px;">A</span>
                </div>
                <span style="color:white;font-size:20px;font-weight:600;">AfriUSD</span>
              </div>

              <!-- Main Card -->
              <div style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;padding:32px;margin-bottom:24px;">
                <p style="color:#6b6b80;font-size:14px;margin:0 0 8px;">Payment Request</p>
                <h1 style="color:white;font-size:28px;font-weight:700;margin:0 0 4px;">You have a new invoice</h1>
                <p style="color:#6b6b80;font-size:14px;margin:0 0 32px;">from ${merchantName}</p>

                <!-- Amount -->
                <div style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                  <p style="color:#6b6b80;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Amount Due</p>
                  <p style="color:#10b981;font-size:36px;font-weight:700;margin:0 0 4px;">${usdcAmount} USDC</p>
                  <p style="color:#6b6b80;font-size:14px;margin:0;">${amount} ${currency}</p>
                </div>

                <!-- Details -->
                <div style="space-y:12px;">
                  <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #1e1e2e;">
                    <span style="color:#6b6b80;font-size:14px;">Invoice ID</span>
                    <span style="color:white;font-size:14px;font-weight:500;">${invoiceId}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #1e1e2e;">
                    <span style="color:#6b6b80;font-size:14px;">Billed to</span>
                    <span style="color:white;font-size:14px;font-weight:500;">${customerName}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #1e1e2e;">
                    <span style="color:#6b6b80;font-size:14px;">Description</span>
                    <span style="color:white;font-size:14px;font-weight:500;">${description}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;padding:12px 0;">
                    <span style="color:#6b6b80;font-size:14px;">Due Date</span>
                    <span style="color:white;font-size:14px;font-weight:500;">${dueDate}</span>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://afriusd.vercel.app/invoice/${invoiceId}" 
                   style="display:inline-block;background:#10b981;color:white;text-decoration:none;padding:16px 48px;border-radius:12px;font-weight:600;font-size:16px;">
                  Pay Invoice Now →
                </a>
              </div>

              <!-- Network Badge -->
              <div style="text-align:center;margin-bottom:32px;">
                <span style="background:#111118;border:1px solid #1e1e2e;color:#6b6b80;font-size:12px;padding:8px 16px;border-radius:20px;">
                  ⚡ Powered by Arc Network · Secured by USDC
                </span>
              </div>

              <!-- Footer -->
              <p style="color:#3a3a4a;font-size:12px;text-align:center;margin:0;">
                This invoice was sent via AfriUSD. If you have questions, contact the merchant directly.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}