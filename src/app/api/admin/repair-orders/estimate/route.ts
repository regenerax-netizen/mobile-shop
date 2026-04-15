import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import {
  getRepairOrderByNumber,
  updateRepairOrderStatus,
  addRepairOrderEvent,
} from "@/lib/repair-orders";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/* POST — Send cost estimate email to customer */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderNumber, estimatedCost, message } = body;

    if (!orderNumber || typeof estimatedCost !== "number") {
      return NextResponse.json(
        { error: "orderNumber and estimatedCost are required." },
        { status: 400 },
      );
    }

    const order = await getRepairOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
    }

    // Update status to estimate_sent and set costs
    const oldStatus = order.status;
    const finalCost = estimatedCost;
    const totalWithShipping = finalCost + (order.shipping_fee || 0);

    const updated = await updateRepairOrderStatus(order.id, "estimate_sent", {
      estimated_cost: estimatedCost,
      final_cost: finalCost,
    });

    if (updated) {
      await addRepairOrderEvent(
        order.id,
        "estimate_sent",
        oldStatus,
        "estimate_sent",
        { estimated_cost: estimatedCost, final_cost: finalCost, message },
      );
    }

    // Send estimate email to customer
    const approveUrl = `${BASE_URL}/api/repair-approve/${order.order_number}?token=${order.approval_token}&action=approve`;
    const rejectUrl = `${BASE_URL}/api/repair-approve/${order.order_number}?token=${order.approval_token}&action=reject`;
    const statusUrl = `${BASE_URL}/de/repair-status/${order.order_number}`;

    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">💰 Kostenvoranschlag für Ihre Reparatur</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Auftrag: ${order.order_number}</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: 0;">
          <p style="font-size: 16px; color: #111827;">Hallo ${order.customer_name},</p>
          <p style="font-size: 15px; color: #374151;">wir haben Ihr Gerät <strong>${order.device_name}</strong> untersucht und einen Kostenvoranschlag erstellt.</p>
          
          ${message ? `<div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Hinweis vom Techniker:</strong></p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #78350f;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>` : ""}

          <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; color: #6b7280;">Reparaturkosten</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #111827;">${finalCost.toFixed(2)}€</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; color: #6b7280;">Versandkosten</td>
                <td style="padding: 10px 0; text-align: right; color: #111827;">${order.shipping_fee > 0 ? `${order.shipping_fee.toFixed(2)}€` : "Kostenlos"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: bold; color: #111827; font-size: 17px;">Gesamt</td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #f97316; font-size: 17px;">${totalWithShipping.toFixed(2)}€</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 15px; color: #374151; margin-bottom: 24px;">Bitte entscheiden Sie, ob wir mit der Reparatur fortfahren sollen:</p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${approveUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: bold; margin: 0 8px;">✓ Reparatur beauftragen</a>
          </div>
          <div style="text-align: center; margin: 16px 0;">
            <a href="${rejectUrl}" style="display: inline-block; background: #f3f4f6; color: #6b7280; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px;">Ablehnen & zurücksenden</a>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 13px; color: #9ca3af;">Status einsehen: <a href="${statusUrl}" style="color: #f97316;">${statusUrl}</a></p>
          </div>

          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
            Diese E-Mail wurde automatisch versendet.
          </div>
        </div>
      </div>
    `;

    if (SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Reparatur Service" <${SMTP_USER}>`,
        to: order.customer_email,
        subject: `Kostenvoranschlag für Ihre Reparatur — ${order.order_number}`,
        html: customerHtml,
      });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Estimate email error:", error);
    return NextResponse.json(
      { error: "An error occurred." },
      { status: 500 },
    );
  }
}
