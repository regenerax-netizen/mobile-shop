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

// ─── Google Reviews ──────────────────────────────────────
export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url?: string;
}

// ─── Device catalog ──────────────────────────────────────
export interface DeviceModel {
  id: string;
  shop_id: string;
  brand: string;
  model_name: string;
  model_image_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface RepairPrice {
  id: string;
  device_model_id: string;
  shop_id: string;
  repair_type: string;
  price: number;
  estimated_time: string;
  active: boolean;
  created_at: string;
}

// ─── Repair orders ───────────────────────────────────────
export type RepairType =
  | "display"
  | "battery"
  | "charging"
  | "camera"
  | "water"
  | "software"
  | "backglass"
  | "other";

export type RepairOrderStatus =
  | "pending"
  | "label_sent"
  | "in_transit_to_shop"
  | "received"
  | "diagnosing"
  | "estimate_sent"
  | "approved"
  | "rejected"
  | "in_repair"
  | "repaired"
  | "quality_check"
  | "in_transit_to_customer"
  | "delivered"
  | "cancelled";

export interface CarrierTracking {
  carrier: string;
  tracking_number: string;
  tracking_url: string;
}

export interface RepairOrder {
  id: string;
  shop_id: string;
  order_number: string;
  status: RepairOrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: {
    street: string;
    zip: string;
    city: string;
    country?: string;
  };
  customer_approved: boolean | null;
  device_model_id: string | null;
  device_brand: string;
  device_name: string;
  device_issue: string | null;
  repair_types: string[];
  pricing_mode: "fixed" | "estimate";
  description?: string | null;
  quoted_price: number | null;
  estimated_cost: number | null;
  final_cost: number | null;
  shipping_fee: number;
  approval_token: string | null;
  inbound_tracking: CarrierTracking | null;
  outbound_tracking: CarrierTracking | null;
  photos: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepairOrderEvent {
  id: string;
  order_id: string;
  event_type: string;
  old_value: string | null;
  new_value: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
