import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  generateOrderNumber,
  generateApprovalToken,
  createRepairOrder,
  addRepairOrderEvent,
} from "@/lib/repair-orders";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { RepairType } from "@/types";

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "thedarkfate777@gmail.com";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

/* Simple in-memory rate limiter — max 5 submissions per IP per 10 minutes */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

async function getShopName(shopId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from("shops")
    .select("name, address")
    .eq("id", shopId)
    .single();
  return data?.name || "Mobile Shop";
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const {
      shopId,
      shopSlug,
      deviceModelId,
      deviceBrand,
      deviceName,
      repairTypes,
      pricingMode,
      quotedPrice,
      shippingFee,
      deviceIssue,
      photos,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      additionalNotes,
      preferredCarrier,
      _hp,
    } = body;

    // Honeypot check
    if (_hp) {
      return NextResponse.json({
        success: true,
        orderNumber: "RE-00000000-XXXX",
      });
    }

    // Basic validation
    if (
      !deviceName ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress
    ) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 },
      );
    }

    if (!Array.isArray(repairTypes) && !deviceIssue) {
      return NextResponse.json(
        {
          error:
            "Bitte wählen Sie mindestens eine Reparatur aus oder beschreiben Sie das Problem.",
        },
        { status: 400 },
      );
    }

    // Sanitize
    const sanitize = (s: unknown) =>
      typeof s === "string"
        ? s
            .replace(/<[^>]*>/g, "")
            .trim()
            .slice(0, 1000)
        : "";

    const orderNumber = generateOrderNumber();
    const approvalToken = generateApprovalToken();
    const shopName = await getShopName(shopId);

    const safeAddress = {
      street: sanitize(customerAddress?.street),
      zip: sanitize(customerAddress?.zip),
      city: sanitize(customerAddress?.city),
      country: sanitize(customerAddress?.country),
    };

    const safeRepairTypes = (Array.isArray(repairTypes)
      ? repairTypes.map((r: unknown) => sanitize(r)).filter(Boolean)
      : []) as RepairType[];

    const orderData = {
      shop_id: shopId,
      order_number: orderNumber,
      status: "pending" as const,
      device_model_id: deviceModelId || null,
      device_brand: sanitize(deviceBrand),
      device_name: sanitize(deviceName),
      repair_types: safeRepairTypes,
      pricing_mode:
        pricingMode === "fixed" ? ("fixed" as const) : ("estimate" as const),
      quoted_price: typeof quotedPrice === "number" ? quotedPrice : null,
      estimated_cost: null,
      final_cost: null,
      shipping_fee: typeof shippingFee === "number" ? shippingFee : 9.99,
      device_issue: sanitize(deviceIssue) || null,
      customer_name: sanitize(customerName),
      customer_email: sanitize(customerEmail),
      customer_phone: sanitize(customerPhone),
      customer_address: safeAddress,
      customer_approved: null,
      notes: [sanitize(additionalNotes), preferredCarrier ? `Versand: ${sanitize(preferredCarrier)}` : "", shopSlug ? `Shop: ${sanitize(shopSlug)}` : ""].filter(Boolean).join(" | ") || null,
      approval_token: approvalToken,
      inbound_tracking: null,
      outbound_tracking: null,
      photos: Array.isArray(photos)
        ? photos.slice(0, 4).filter((p: unknown) => typeof p === "string" && (p as string).startsWith("data:image/"))
        : [],
    };

    // Try to insert into database
    const order = await createRepairOrder(orderData);

    if (order) {
      await addRepairOrderEvent(order.id, "created", null, "pending");
    }

    // Build HTML email notification
    const repairLabels: Record<string, string> = {
      display: "Display-Reparatur",
      battery: "Akku-Tausch",
      charging: "Ladebuchse",
      camera: "Kamera-Reparatur",
      water: "Wasserschaden",
      software: "Software-Reparatur",
      backglass: "Backcover/Rückglas",
      other: "Sonstiges",
    };

    const repairList = safeRepairTypes
      .map((r) => repairLabels[r] || r)
      .join(", ");
    const priceText =
      pricingMode === "fixed" && quotedPrice
        ? `${quotedPrice.toFixed(2)}€ + ${(shippingFee ?? 9.99).toFixed(2)}€ Versand`
        : "Kostenvoranschlag nach Diagnose";

    const htmlEmail = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🔧 Neue Reparaturanfrage</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Auftragsnr. ${orderNumber}</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600; width: 40%;">Shop</td>
              <td style="padding: 12px 0; color: #111827;">${shopName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Gerät</td>
              <td style="padding: 12px 0; color: #111827;">${sanitize(deviceName)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Reparaturen</td>
              <td style="padding: 12px 0; color: #111827;">${repairList || "Diagnose erforderlich"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Preismodell</td>
              <td style="padding: 12px 0; color: #111827;">${priceText}</td>
            </tr>
            ${orderData.device_issue ? `<tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 12px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Beschreibung</td><td style="padding: 12px 0; color: #111827;">${orderData.device_issue}</td></tr>` : ""}
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Name</td>
              <td style="padding: 12px 0; color: #111827;">${orderData.customer_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Telefon</td>
              <td style="padding: 12px 0; color: #111827;"><a href="tel:${orderData.customer_phone}" style="color: #f97316;">${orderData.customer_phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">E-Mail</td>
              <td style="padding: 12px 0; color: #111827;"><a href="mailto:${orderData.customer_email}" style="color: #f97316;">${orderData.customer_email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Adresse</td>
              <td style="padding: 12px 0; color: #111827;">${safeAddress.street}<br/>${safeAddress.zip} ${safeAddress.city}<br/>${safeAddress.country}</td>
            </tr>
            ${preferredCarrier ? `<tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 12px 0; color: #6b7280; font-weight: 600;">Versand via</td><td style="padding: 12px 0; color: #111827; font-weight: 600;">${sanitize(preferredCarrier)}</td></tr>` : ""}
            ${orderData.notes ? `<tr><td style="padding: 12px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Hinweise</td><td style="padding: 12px 0; color: #111827;">${orderData.notes}</td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
            Gesendet über ${shopName} • ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
          </div>
        </div>
      </div>
    `;

    // Send admin notification email
    if (SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const attachments = orderData.photos
        .filter((p) => p.startsWith("data:image/"))
        .map((dataUrl, i) => {
          const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
          if (!matches) return null;
          return {
            filename: `photo-${i + 1}.${matches[1]}`,
            content: matches[2],
            encoding: "base64" as const,
            cid: `photo${i}`,
          };
        })
        .filter(Boolean);

      await transporter.sendMail({
        from: `"${shopName}" <${SMTP_USER}>`,
        to: NOTIFICATION_EMAIL,
        subject: `🔧 Reparaturanfrage ${orderNumber}: ${sanitize(deviceName)} — ${orderData.customer_name}`,
        html: htmlEmail,
        attachments: attachments as nodemailer.SendMailOptions["attachments"],
      });

      // Send confirmation to customer
      const safeCarrier = sanitize(preferredCarrier) || "DHL";
      const carrierDropoffUrls: Record<string, string> = {
        DHL: "https://www.dhl.de/de/privatkunden/pakete-versenden/pakete-abgeben.html",
        DPD: "https://www.dpd.com/de/de/empfangen/paketshops-finden/",
        Hermes: "https://www.myhermes.de/paketshop/",
        GLS: "https://gls-group.eu/DE/de/depot-suche",
        UPS: "https://www.ups.com/dropoff?loc=de_DE",
      };
      const dropoffUrl = carrierDropoffUrls[safeCarrier] || carrierDropoffUrls.DHL;

      const customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">📱 Reparaturauftrag bestätigt</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Auftragsnummer: ${orderNumber}</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: 0;">
            <p style="font-size: 16px; color: #111827;">Hallo ${orderData.customer_name},</p>
            <p style="font-size: 15px; color: #374151;">vielen Dank für Ihre Reparaturanfrage! Wir haben Ihren Auftrag erhalten.</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Ihre Auftragsnummer:</p>
              <p style="margin: 4px 0 0; font-size: 24px; font-weight: bold; color: #111827; font-family: monospace;">${orderNumber}</p>
            </div>
            <h3 style="font-size: 16px; color: #111827; margin-top: 24px;">📦 Nächste Schritte:</h3>
            <ol style="font-size: 14px; color: #374151; line-height: 2;">
              <li>Verpacken Sie Ihr Gerät sicher (Originalverpackung oder gepolsterter Umschlag)</li>
              <li>Legen Sie einen Zettel mit Ihrer Auftragsnummer bei: <strong>${orderNumber}</strong></li>
              <li>Senden Sie das Paket per <strong>${safeCarrier}</strong> an uns</li>
            </ol>
            <p style="text-align: center; margin: 16px 0;">
              📍 <a href="${dropoffUrl}" style="color: #f97316;">${safeCarrier}-Paketshop in Ihrer Nähe finden</a>
            </p>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
              ${shopName} • Diese E-Mail wurde automatisch versendet.
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"${shopName}" <${SMTP_USER}>`,
        to: orderData.customer_email,
        subject: `Reparaturauftrag bestätigt — ${orderNumber}`,
        html: customerHtml,
      });
    }

    return NextResponse.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Repair request error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." },
      { status: 500 },
    );
  }
}
