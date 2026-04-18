import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getRepairOrderByNumber,
  updateRepairOrderStatus,
  addRepairOrderEvent,
} from "@/lib/repair-orders";
import { verifyShopAdminToken } from "@/lib/shop-admin-auth";
import type { RepairOrderStatus } from "@/types";

const VALID_STATUSES: RepairOrderStatus[] = [
  "pending", "label_sent", "in_transit_to_shop", "received",
  "diagnosing", "estimate_sent", "approved", "rejected",
  "in_repair", "repaired", "quality_check",
  "in_transit_to_customer", "delivered", "cancelled",
];

function getShopIdFromCookie(request: NextRequest): string | null {
  const cookie = request.cookies.get("shop_admin_token")?.value;
  if (!cookie) return null;
  return verifyShopAdminToken(cookie);
}

/* GET — List all repair orders for this shop */
export async function GET(request: NextRequest) {
  const shopId = getShopIdFromCookie(request);
  if (!shopId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orders, error } = await supabaseAdmin
    .from("repair_orders")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }

  return NextResponse.json({ orders: orders || [] });
}

/* PATCH — Update order status + optional fields */
export async function PATCH(request: NextRequest) {
  const shopId = getShopIdFromCookie(request);
  if (!shopId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderNumber, status, estimatedCost, finalCost, inboundTracking, outboundTracking, notes } = body;

    if (!orderNumber || !status) {
      return NextResponse.json(
        { error: "orderNumber and status are required." },
        { status: 400 },
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: ${status}` },
        { status: 400 },
      );
    }

    const order = await getRepairOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Verify this order belongs to the authenticated shop
    if (order.shop_id !== shopId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const extra: Record<string, unknown> = {};
    if (typeof estimatedCost === "number") extra.estimated_cost = estimatedCost;
    if (typeof finalCost === "number") extra.final_cost = finalCost;
    if (notes !== undefined) extra.notes = notes;
    if (inboundTracking) extra.inbound_tracking = inboundTracking;
    if (outboundTracking) extra.outbound_tracking = outboundTracking;

    const oldStatus = order.status;
    const updated = await updateRepairOrderStatus(order.id, status, extra);

    if (updated) {
      await addRepairOrderEvent(
        order.id,
        "status_change",
        oldStatus,
        status,
        { updated_by: "shop_admin", shop_id: shopId, ...extra },
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch {
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
