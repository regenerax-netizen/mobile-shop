import { NextRequest, NextResponse } from "next/server";
import {
  getRepairOrderByNumber,
  updateRepairOrderStatus,
  addRepairOrderEvent,
} from "@/lib/repair-orders";

interface RouteContext {
  params: { orderNumber: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { orderNumber } = params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const action = searchParams.get("action");

    if (!token || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 },
      );
    }

    const order = await getRepairOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        { error: "Auftrag nicht gefunden." },
        { status: 404 },
      );
    }

    // Validate approval token
    if (order.approval_token !== token) {
      return NextResponse.json(
        { error: "Ungültiger Bestätigungslink." },
        { status: 403 },
      );
    }

    // Only allow approval when estimate has been sent
    if (order.status !== "estimate_sent") {
      return NextResponse.json(
        {
          error:
            "Dieser Auftrag kann im aktuellen Status nicht genehmigt werden.",
        },
        { status: 409 },
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    const updated = await updateRepairOrderStatus(order.id, newStatus);

    if (updated) {
      await addRepairOrderEvent(
        order.id,
        `customer_${action}`,
        "estimate_sent",
        newStatus,
        { action, final_cost: order.final_cost },
      );
    }

    // Extract shop slug from notes (format: "... | Shop: slugname")
    const shopSlugMatch = order.notes?.match(/Shop:\s*(\S+)/);
    const slug = shopSlugMatch?.[1] || "";
    const locale = request.headers.get("accept-language")?.startsWith("en")
      ? "en"
      : "de";

    // Redirect to the status page under the shop's slug
    return NextResponse.redirect(
      new URL(`/${locale}/${slug}/repair-status/${orderNumber}`, request.url),
    );
  } catch (error) {
    console.error("Repair approve error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten." },
      { status: 500 },
    );
  }
}
