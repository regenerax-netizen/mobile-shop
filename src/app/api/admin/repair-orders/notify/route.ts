import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import { getRepairOrderByNumber } from "@/lib/repair-orders";

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

/* POST — Send status update notification to customer */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
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

    const statusUrl = `${BASE_URL}/de/repair-status/${order.order_number}`;
    const statusLabel = STATUS_LABELS[newStatus] || newStatus;

    let customerHtml: string;
    let emailSubject: string;

    /* ── Shipping Label Email ─────────────────────────── */
    if (shippingLabel && newStatus === "label_sent") {
      const carrierDropoffUrls: Record<string, string> = {
        DHL: "https://www.dhl.de/de/privatkunden/pakete-versenden/pakete-abgeben.html",
        DPD: "https://www.dpd.com/de/de/empfangen/paketshop-finder/",
        Hermes: "https://www.myhermes.de/paketshop/",
        GLS: "https://gls-group.com/DE/de/paketshop-finden",
        UPS: "https://www.ups.com/dropoff?loc=de_DE",
      };
      const dropoffUrl = carrierDropoffUrls[shippingLabel.carrier] || carrierDropoffUrls.DHL;

      emailSubject = `Versandanweisung für Ihre Reparatur — ${order.order_number}`;
      customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">📦 Versandanweisung</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Auftrag: ${order.order_number}</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: 0;">
            <p style="font-size: 16px; color: #111827;">Hallo ${order.customer_name},</p>
            <p style="font-size: 15px; color: #374151;">vielen Dank für Ihren Reparaturauftrag! Bitte senden Sie Ihr Gerät <strong>${order.device_name}</strong> mit <strong>${shippingLabel.carrier}</strong> an uns.</p>

            <div style="background: #f3f4f6; border-radius: 12px; margin: 24px 0; overflow: hidden;">
              <div style="display: flex;">
                <div style="flex: 1; padding: 20px; border-right: 2px dashed #d1d5db;">
                  <p style="margin: 0 0 4px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Absender</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${shippingLabel.fromName}</p>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">${shippingLabel.fromAddress}</p>
                </div>
                <div style="flex: 1; padding: 20px;">
                  <p style="margin: 0 0 4px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Empfänger</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${shippingLabel.toName}</p>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">${shippingLabel.toAddress}</p>
                </div>
              </div>
            </div>

            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">📋 So geht&rsquo;s:</p>
              <ol style="margin: 8px 0 0; padding-left: 20px; font-size: 13px; color: #78350f; line-height: 1.8;">
                <li>Drucken Sie diese E-Mail aus oder notieren Sie die Adressen</li>
                <li>Verpacken Sie Ihr Gerät sicher (Luftpolsterfolie empfohlen)</li>
                <li>Gehen Sie zum nächsten <strong>${shippingLabel.carrier}</strong>-Paketshop</li>
                <li>Geben Sie das Paket mit der Empfängeradresse ab</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${dropoffUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #4338ca); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: bold;">📍 ${shippingLabel.carrier}-Shop finden</a>
            </div>

            <div style="text-align: center; margin: 16px 0;">
              <a href="${statusUrl}" style="display: inline-block; color: #4f46e5; text-decoration: none; padding: 10px 24px; border: 2px solid #e0e7ff; border-radius: 10px; font-size: 14px; font-weight: 600;">Status-Seite öffnen</a>
            </div>

            <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">Gewicht: bis ${shippingLabel.weight} kg</p>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
              Diese E-Mail wurde automatisch versendet.
            </div>
          </div>
        </div>
      `;
    }
    /* ── Standard Status Email ────────────────────────── */
    else {
      let trackingHtml = "";
      if (trackingInfo?.tracking_url) {
        trackingHtml = `
          <div style="background: #ecfdf5; border-left: 4px solid #22c55e; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>📦 Sendungsverfolgung:</strong></p>
            <p style="margin: 4px 0 0; font-size: 14px;"><a href="${trackingInfo.tracking_url}" style="color: #059669;">${trackingInfo.carrier}: ${trackingInfo.tracking_number}</a></p>
          </div>
        `;
      }

      emailSubject = `Reparatur-Update: ${statusLabel} — ${order.order_number}`;
      customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">📱 Status-Update: ${statusLabel}</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Auftrag: ${order.order_number}</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: 0;">
            <p style="font-size: 16px; color: #111827;">Hallo ${order.customer_name},</p>
            <p style="font-size: 15px; color: #374151;">der Status Ihrer Reparatur für <strong>${order.device_name}</strong> wurde aktualisiert:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Neuer Status</p>
              <p style="margin: 8px 0 0; font-size: 20px; font-weight: bold; color: #f97316;">${statusLabel}</p>
            </div>

            ${trackingHtml}

            <div style="text-align: center; margin: 24px 0;">
              <a href="${statusUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: bold;">Status-Seite öffnen</a>
            </div>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
              Diese E-Mail wurde automatisch versendet.
            </div>
          </div>
        </div>
      `;
    }

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
        subject: emailSubject,
        html: customerHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify email error:", error);
    return NextResponse.json(
      { error: "An error occurred." },
      { status: 500 },
    );
  }
}
