// ─── Database rows ────────────────────────────────────────
export interface Shop {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_embed_url: string;
  logo_url: string;
  hero_image_url: string;
  hero_images: string[];
  accent_color: string;
  secondary_color: string;
  opening_hours: { day: string; hours: string }[];
  services: { title: string; icon: string }[];
  partner_services: string[];
  partner_logos: Record<string, string>;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  category: "phones" | "accessories";
  description: string;
  image_url: string;
  active: boolean;
  created_at: string;
}

export interface RepairService {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  estimated_time: string;
  description: string;
  active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  shop_id: string;
  reviewer_name: string;
  review_text: string;
  rating: number;
  created_at: string;
}
