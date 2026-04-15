import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllRepairOrders,
  getRepairOrderByNumber,
  updateRepairOrderStatus,
  addRepairOrderEvent,
} from "@/lib/repair-orders";
import type { RepairOrderStatus } from "@/types";

const VALID_STATUSES: RepairOrderStatus[] = [
  "pending", "label_sent", "in_transit_to_shop", "received",
  "diagnosing", "estimate_sent", "approved", "rejected",
  "in_repair", "repaired", "quality_check",
  "in_transit_to_customer", "delivered", "cancelled",
];

/* GET — List all repair orders */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getAllRepairOrders();
  return NextResponse.json({ orders });
}

/* PATCH — Update order status + optional fields */
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
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
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
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
        { updated_by: "admin", ...extra },
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin update error:", error);
    return NextResponse.json(
      { error: "An error occurred." },
      { status: 500 },
    );
  }
}
