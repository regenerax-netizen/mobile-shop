import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getRepairOrderByNumber } from "@/lib/repair-orders";
import { verifyShopAdminToken } from "@/lib/shop-admin-auth";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const STATUS_LABELS: Record<string, string> = {
  pending: "Anfrage erhalten",
  label_sent: "Versandlabel erstellt",
  in_transit_to_shop: "Gerät unterwegs",
  received: "Gerät angekommen",
  diagnosing: "Diagnose läuft",
  estimate_sent: "Kostenvoranschlag gesendet",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  in_repair: "Reparatur läuft",
  repaired: "Repariert",
  quality_check: "Qualitätsprüfung",
  in_transit_to_customer: "Rückversand",
  delivered: "Zugestellt",
  cancelled: "Storniert",
};

function getShopIdFromCookie(request: NextRequest): string | null {
  const cookie = request.cookies.get("shop_admin_token")?.value;
  if (!cookie) return null;
  return verifyShopAdminToken(cookie);
}

/* POST — Send status update notification to customer */
export async function POST(request: NextRequest) {
  const shopId = getShopIdFromCookie(request);
  if (!shopId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderNumber, newStatus, trackingInfo, shippingLabel } = body;

    if (!orderNumber || !newStatus) {
      return NextResponse.json(
        { error: "orderNumber and newStatus are required." },
        { status: 400 },
      );
    }

    const order = await getRepairOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.shop_id !== shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({
        success: true,
        message: "Email not configured, skipping notification.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const statusLabel = STATUS_LABELS[newStatus] || newStatus;
    const statusUrl = `${BASE_URL}/de/repair-status/${order.order_number}`;

    let extraHtml = "";

    if (newStatus === "label_sent" && shippingLabel) {
      extraHtml = `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px; font-size: 15px; color: #1e40af;">📦 Versandanweisung</h3>
          <p style="font-size: 14px; color: #1e3a5f; margin: 0 0 8px;">Bitte senden Sie Ihr Gerät an:</p>
          <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #dbeafe;">
            <p style="margin: 0; font-size: 14px;"><strong>${shippingLabel.toName}</strong></p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">${shippingLabel.toAddress}</p>
          </div>
          <p style="margin: 12px 0 0; font-size: 13px; color: #1e40af;">Bevorzugter Versand: <strong>${shippingLabel.carrier}</strong></p>
        </div>`;
    }

    if (trackingInfo) {
      extraHtml += `
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px; font-size: 15px; color: #065f46;">🚚 Sendungsverfolgung</h3>
          <p style="font-size: 14px; color: #065f46; margin: 0;">
            <strong>${trackingInfo.carrier}</strong>: ${trackingInfo.tracking_number}
          </p>
          ${trackingInfo.tracking_url ? `<a href="${trackingInfo.tracking_url}" style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: #059669; color: white; text-decoration: none; border-radius: 8px; font-size: 13px;">Sendung verfolgen →</a>` : ""}
        </div>`;
    }

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🔔 Status-Update: ${statusLabel}</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Auftrag: ${order.order_number}</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: 0;">
          <p style="font-size: 16px; color: #111827;">Hallo ${order.customer_name},</p>
          <p style="font-size: 15px; color: #374151;">der Status Ihrer Reparatur wurde aktualisiert:</p>
          <div style="background: #f3f4f6; padding: 16px 20px; border-radius: 12px; margin: 16px 0; text-align: center;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #111827;">${statusLabel}</p>
          </div>
          ${extraHtml}
          <a href="${statusUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">Status ansehen →</a>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `"Reparatur-Service" <${SMTP_USER}>`,
      to: order.customer_email,
      subject: `Reparatur-Update: ${statusLabel} — ${order.order_number}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({
      success: true,
      message: "Email sending failed but status was updated.",
    });
  }
}
