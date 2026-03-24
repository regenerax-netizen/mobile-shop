import { supabase } from "@/lib/supabase";
import { sampleProducts, sampleRepairs, sampleShop, sampleReviews } from "@/lib/sample-data";
import type { Product, RepairService, Shop, Review } from "@/types";

/* ─── Shop queries ─────────────────────────────────────── */

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  if (error || !data) {
    // Fall back to sample if slug matches
    if (slug === sampleShop.slug) return sampleShop;
    return null;
  }
  return data;
}

export async function getAllShops(): Promise<Shop[]> {
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    return [sampleShop];
  }
  return data;
}

/* ─── Product queries ──────────────────────────────────── */

export async function getShopProducts(shopId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (shopId === sampleShop.id) return sampleProducts;
    return [];
  }
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    return sampleProducts;
  }
  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (id.startsWith("sample-")) {
    return sampleProducts.find((p) => p.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

/* ─── Repair queries ───────────────────────────────────── */

export async function getShopRepairs(shopId: string): Promise<RepairService[]> {
  const { data, error } = await supabase
    .from("repair_services")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (shopId === sampleShop.id) return sampleRepairs;
    return [];
  }
  return data;
}

export async function getRepairServices(): Promise<RepairService[]> {
  const { data, error } = await supabase
    .from("repair_services")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    return sampleRepairs;
  }
  return data;
}

/* ─── Review queries ───────────────────────────────────── */

export async function getShopReviews(shopId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (shopId === sampleShop.id) return sampleReviews;
    return [];
  }
  return data;
}
