// ─── Database rows ────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  category: "phones" | "accessories";
  description: string;
  image_url: string;
  created_at: string;
}

export interface RepairService {
  id: string;
  name: string;
  price: number;
  estimated_time: string;
  description: string;
  created_at: string;
}

export interface ShopConfigRow {
  id: string;
  key: string;
  value: string;
}
