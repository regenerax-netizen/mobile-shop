import { supabase } from "@/lib/supabase";
import { sampleProducts, sampleRepairs } from "@/lib/sample-data";
import type { Product, RepairService } from "@/types";

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
  // Check sample data first for sample IDs
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
