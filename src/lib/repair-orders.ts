import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  sampleDeviceModels,
  sampleRepairPrices,
} from "@/lib/sample-repair-data";
import type {
  DeviceModel,
  RepairPrice,
  RepairOrder,
  RepairOrderEvent,
} from "@/types";
import crypto from "crypto";

/* ─── Device catalog queries ────────────────────────────── */

export async function getDeviceModels(shopId: string): Promise<DeviceModel[]> {
  const { data, error } = await supabase
    .from("device_models")
    .select("*")
    .eq("shop_id", shopId)
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return sampleDeviceModels;
  return data;
}

export async function getRepairPricesForDevice(
  deviceModelId: string,
): Promise<RepairPrice[]> {
  const { data, error } = await supabase
    .from("repair_prices")
    .select("*")
    .eq("device_model_id", deviceModelId)
    .eq("active", true);
  if (error || !data || data.length === 0) {
    return sampleRepairPrices.filter(
      (p) => p.device_model_id === deviceModelId,
    );
  }
  return data;
}

export async function getAllRepairPrices(
  shopId: string,
): Promise<RepairPrice[]> {
  const { data, error } = await supabase
    .from("repair_prices")
    .select("*")
    .eq("shop_id", shopId)
    .eq("active", true);
  if (error || !data || data.length === 0) return sampleRepairPrices;
  return data;
}

/* ─── Order number generation ───────────────────────────── */

export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `RE-${date}-${rand}`;
}

export function generateApprovalToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/* ─── Repair order queries ──────────────────────────────── */

export async function createRepairOrder(
  order: Omit<RepairOrder, "id" | "created_at" | "updated_at">,
): Promise<RepairOrder | null> {
  const { data, error } = await supabaseAdmin
    .from("repair_orders")
    .insert(order)
    .select()
    .single();
  if (error) {
    console.error("Failed to create repair order:", error);
    return null;
  }
  return data;
}

export async function getRepairOrderByNumber(
  orderNumber: string,
): Promise<RepairOrder | null> {
  const { data, error } = await supabaseAdmin
    .from("repair_orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();
  if (error || !data) return null;
  return data;
}

export async function updateRepairOrderStatus(
  orderId: string,
  status: string,
  extra?: Partial<RepairOrder>,
): Promise<RepairOrder | null> {
  const { data, error } = await supabaseAdmin
    .from("repair_orders")
    .update({ status, ...extra })
    .eq("id", orderId)
    .select()
    .single();
  if (error) return null;
  return data;
}

export async function addRepairOrderEvent(
  orderId: string,
  eventType: string,
  oldValue: string | null,
  newValue: string | null,
  metadata?: Record<string, unknown>,
): Promise<RepairOrderEvent | null> {
  const { data, error } = await supabaseAdmin
    .from("repair_order_events")
    .insert({
      order_id: orderId,
      event_type: eventType,
      old_value: oldValue,
      new_value: newValue,
      metadata: metadata || {},
    })
    .select()
    .single();
  if (error) return null;
  return data;
}

export async function getRepairOrderEvents(
  orderId: string,
): Promise<RepairOrderEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("repair_order_events")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data;
}

/* ─── Admin queries ─────────────────────────────────────── */

export async function getAllRepairOrders(): Promise<RepairOrder[]> {
  const { data, error } = await supabaseAdmin
    .from("repair_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch repair orders:", error);
    return [];
  }
  return data || [];
}

export async function getRepairOrderById(
  id: string,
): Promise<RepairOrder | null> {
  const { data, error } = await supabaseAdmin
    .from("repair_orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}
