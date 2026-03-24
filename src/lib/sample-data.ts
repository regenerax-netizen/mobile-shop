import type { Product, RepairService, Shop, Review } from "@/types";

export const sampleShop: Shop = {
  id: "sample-shop-1",
  name: "MobileHub",
  slug: "mobilehub",
  tagline: "Your Trusted Mobile Phone Specialists",
  phone: "+44 7700 900123",
  whatsapp: "447700900123",
  email: "hello@mobilehub.com",
  address: "123 High Street, London, EC1A 1BB",
  google_maps_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.542339!2d-0.0877321!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjYiTiAwwrAwNScxNS44Ilc!5e0!3m2!1sen!2suk!4v1700000000000",
  logo_url: "",
  hero_image_url:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop",
  accent_color: "#f97316",
  opening_hours: [
    { day: "Monday", hours: "9:00 AM – 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM – 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM – 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM – 7:00 PM" },
    { day: "Friday", hours: "9:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM – 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  services: [
    { title: "Phone Repair", icon: "wrench" },
    { title: "Phone Sales", icon: "smartphone" },
    { title: "Accessories", icon: "headphones" },
    { title: "SIM Cards & Unlocking", icon: "sim" },
  ],
  active: true,
  created_at: new Date().toISOString(),
};

export const sampleReviews: Review[] = [
  {
    id: "review-1",
    shop_id: "sample-shop-1",
    reviewer_name: "Sarah M.",
    review_text:
      "Brilliant service! Had my screen replaced in under an hour. Prices are very fair and the staff are super friendly.",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "review-2",
    shop_id: "sample-shop-1",
    reviewer_name: "James K.",
    review_text:
      "Bought a refurbished iPhone here — works like new. They even threw in a free case. Highly recommend!",
    rating: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "review-3",
    shop_id: "sample-shop-1",
    reviewer_name: "Priya D.",
    review_text:
      "Best phone shop in town. Quick unlocking service and great advice on which phone to buy. Five stars!",
    rating: 5,
    created_at: new Date().toISOString(),
  },
];

export const sampleProducts: Product[] = [
  {
    id: "sample-1",
    shop_id: "sample-shop-1",
    name: "iPhone 15 Pro Max",
    price: 1299,
    category: "phones",
    description:
      "Das neueste Apple-Flaggschiff mit Titan-Design, A17 Pro Chip, 48 MP Kamera-System und USB-C. Erleben Sie die nächste Generation mobiler Technologie.",
    image_url:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    shop_id: "sample-shop-1",
    name: "Samsung Galaxy S24 Ultra",
    price: 1199,
    category: "phones",
    description:
      "Samsungs Premium-Smartphone mit integriertem S Pen, 200 MP Kamera, Snapdragon 8 Gen 3 und brillantem AMOLED-Display.",
    image_url:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    shop_id: "sample-shop-1",
    name: "Google Pixel 8 Pro",
    price: 899,
    category: "phones",
    description:
      "Das smarte Google-Phone mit Tensor G3 Chip, branchenführender KI-Fotografie und 7 Jahren Software-Updates.",
    image_url:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-4",
    shop_id: "sample-shop-1",
    name: "iPhone 14",
    price: 699,
    category: "phones",
    description:
      "Leistungsstarkes iPhone mit A15 Bionic Chip, fortschrittlichem Dual-Kamera-System und ganztägiger Akkulaufzeit. Perfektes Preis-Leistungs-Verhältnis.",
    image_url:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-5",
    shop_id: "sample-shop-1",
    name: "Samsung Galaxy A54",
    price: 449,
    category: "phones",
    description:
      "Samsungs beliebtes Mittelklasse-Smartphone mit AMOLED-Display, Triple-Kamera und wassergeschütztem Gehäuse.",
    image_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-6",
    shop_id: "sample-shop-1",
    name: "Apple AirPods Pro 2",
    price: 279,
    category: "accessories",
    description:
      "Premium In-Ear-Kopfhörer mit aktiver Geräuschunterdrückung, adaptiver Transparenz und personalisiertem 3D-Audio.",
    image_url:
      "https://images.unsplash.com/photo-1588423771073-b8903fdes564?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-7",
    shop_id: "sample-shop-1",
    name: "MagSafe Ladegerät",
    price: 49,
    category: "accessories",
    description:
      "Kabelloses Ladegerät mit perfekter magnetischer Ausrichtung für alle iPhone 12 und neuer. Schnelles und bequemes Laden.",
    image_url:
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-8",
    shop_id: "sample-shop-1",
    name: "Samsung Galaxy Buds2 Pro",
    price: 179,
    category: "accessories",
    description:
      "Hi-Fi-Ohrhörer mit intelligentem ANC, 360-Audio und nahtloser Galaxy-Integration. Kristallklarer Sound den ganzen Tag.",
    image_url:
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80",
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const sampleRepairs: RepairService[] = [
  {
    id: "repair-1",
    shop_id: "sample-shop-1",
    name: "Display-Reparatur",
    price: 89,
    estimated_time: "30-60 Min",
    description:
      "Professioneller Austausch von gebrochenen oder beschädigten Displays für alle gängigen Smartphone-Modelle. Original-Qualität garantiert.",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-2",
    shop_id: "sample-shop-1",
    name: "Akku-Austausch",
    price: 59,
    estimated_time: "20-40 Min",
    description:
      "Neuer Akku für mehr Laufzeit. Wir verwenden hochwertige Ersatzakkus mit voller Kapazität und Garantie.",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-3",
    shop_id: "sample-shop-1",
    name: "Wasserschaden-Behandlung",
    price: 79,
    estimated_time: "2-24 Std",
    description:
      "Spezialreinigung und Trocknung bei Wasserschäden. Schnelles Handeln erhöht die Erfolgschancen erheblich.",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-4",
    shop_id: "sample-shop-1",
    name: "Ladeanschluss-Reparatur",
    price: 69,
    estimated_time: "30-60 Min",
    description:
      "Reparatur oder Austausch defekter Ladebuchsen (USB-C / Lightning). Wieder zuverlässig laden.",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-5",
    shop_id: "sample-shop-1",
    name: "Rückglas-Austausch",
    price: 99,
    estimated_time: "45-90 Min",
    description:
      "Professioneller Austausch des rückseitigen Glases bei iPhone und Samsung Galaxy Modellen. Wie neu.",
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-6",
    shop_id: "sample-shop-1",
    name: "Kamera-Reparatur",
    price: 89,
    estimated_time: "30-60 Min",
    description:
      "Austausch defekter Front- oder Rückkameras. Scharfe Fotos und Videos wie am ersten Tag.",
    active: true,
    created_at: new Date().toISOString(),
  },
];
