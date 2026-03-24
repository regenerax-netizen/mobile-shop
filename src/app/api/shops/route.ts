import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Sample data inserted into every new shop automatically
const DEFAULT_PRODUCTS = [
  { name: "iPhone 15 Pro Max", price: 1299, category: "phones", description: "Das neueste Apple-Flaggschiff mit Titan-Design, A17 Pro Chip und 48 MP Kamera. USB-C, Action-Button und beeindruckende Akkulaufzeit.", image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", active: true },
  { name: "Samsung Galaxy S24 Ultra", price: 1199, category: "phones", description: "Samsungs Premium-Smartphone mit integriertem S Pen, 200 MP Kamera, Snapdragon 8 Gen 3 und brillantem AMOLED-Display.", image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80", active: true },
  { name: "iPhone 14 – Generalüberholt", price: 699, category: "phones", description: "Leistungsstarkes iPhone mit A15 Bionic Chip und Dual-Kamera. Geprüfte Qualität, 12 Monate Garantie inklusive.", image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80", active: true },
  { name: "Samsung Galaxy A54", price: 349, category: "phones", description: "Samsungs beliebtes Mittelklasse-Smartphone mit AMOLED-Display, Triple-Kamera und wassergeschütztem Gehäuse.", image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", active: true },
  { name: "Apple AirPods Pro 2", price: 249, category: "accessories", description: "Premium In-Ear-Kopfhörer mit aktiver Geräuschunterdrückung, adaptiver Transparenz und personalisiertem 3D-Audio.", image_url: "https://images.unsplash.com/photo-1588423771073-b8903fbb7e3b?w=800&q=80", active: true },
  { name: "Schutzglas & Hülle Bundle", price: 29, category: "accessories", description: "2-teiliges Rundum-Schutzset: 9H Panzerglas + stoßfeste Silikonhülle. Verfügbar für alle gängigen Modelle.", image_url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80", active: true },
];

const DEFAULT_REPAIRS = [
  { name: "Display-Reparatur", price: 89, estimated_time: "30–60 Min", description: "Professioneller Austausch von gebrochenen oder beschädigten Displays. Original-Qualität, Garantie inklusive.", active: true },
  { name: "Akku-Austausch", price: 59, estimated_time: "20–40 Min", description: "Neuer Akku für mehr Laufzeit. Hochwertige Ersatzakkus mit voller Kapazität und 6 Monate Garantie.", active: true },
  { name: "Wasserschaden-Behandlung", price: 79, estimated_time: "2–24 Std", description: "Spezialreinigung und Trocknung bei Wasserschäden. Schnelles Handeln erhöht die Erfolgschancen erheblich.", active: true },
  { name: "Ladeanschluss-Reparatur", price: 69, estimated_time: "30–60 Min", description: "Reparatur oder Austausch defekter Ladebuchsen (USB-C / Lightning). Wieder zuverlässig und schnell laden.", active: true },
  { name: "Rückglas-Austausch", price: 99, estimated_time: "45–90 Min", description: "Professioneller Austausch des rückseitigen Glases bei iPhone und Samsung Galaxy Modellen.", active: true },
  { name: "Kamera-Reparatur", price: 89, estimated_time: "30–60 Min", description: "Austausch defekter Front- oder Rückkameras. Scharfe Fotos und Videos wie am ersten Tag.", active: true },
];

const DEFAULT_REVIEWS = [
  { reviewer_name: "Sarah M.", review_text: "Toller Service! Mein Display wurde in unter einer Stunde ausgetauscht. Faire Preise und super freundliches Personal.", rating: 5 },
  { reviewer_name: "Thomas K.", review_text: "Habe hier ein generalüberholtes iPhone gekauft — funktioniert wie neu. Sehr empfehlenswert!", rating: 5 },
  { reviewer_name: "Priya D.", review_text: "Bester Handyladen der Stadt. Schneller Entsperrservice und tolle Beratung beim Handykauf. Fünf Sterne!", rating: 5 },
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name, slug, tagline, phone, whatsapp, email, address,
    google_maps_embed_url, logo_url, hero_image_url, hero_images,
    accent_color, secondary_color, partner_services, partner_logos, opening_hours, services, active,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("shops")
    .insert({
      name, slug, tagline, phone, whatsapp, email, address,
      google_maps_embed_url, logo_url, hero_image_url,
      hero_images: hero_images ?? [],
      accent_color,
      secondary_color: secondary_color ?? "",
      partner_services: partner_services ?? [],
      partner_logos: partner_logos ?? {},
      opening_hours: opening_hours ?? [],
      services: services ?? [],
      active: active ?? true,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const shopId = data.id;

  // Auto-populate products, repairs, and reviews so every new shop looks full immediately
  await Promise.all([
    supabaseAdmin.from("products").insert(
      DEFAULT_PRODUCTS.map((p) => ({ ...p, shop_id: shopId }))
    ),
    supabaseAdmin.from("repair_services").insert(
      DEFAULT_REPAIRS.map((r) => ({ ...r, shop_id: shopId }))
    ),
    supabaseAdmin.from("reviews").insert(
      DEFAULT_REVIEWS.map((r) => ({ ...r, shop_id: shopId }))
    ),
  ]);

  return NextResponse.json(data, { status: 201 });
}
