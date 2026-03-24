import type { Product, RepairService } from "@/types";

export const sampleProducts: Product[] = [
  {
    id: "sample-1",
    name: "iPhone 15 Pro Max",
    price: 1299,
    category: "phones",
    description:
      "Das neueste Apple-Flaggschiff mit Titan-Design, A17 Pro Chip, 48 MP Kamera-System und USB-C. Erleben Sie die nächste Generation mobiler Technologie.",
    image_url:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    name: "Samsung Galaxy S24 Ultra",
    price: 1199,
    category: "phones",
    description:
      "Samsungs Premium-Smartphone mit integriertem S Pen, 200 MP Kamera, Snapdragon 8 Gen 3 und brillantem AMOLED-Display.",
    image_url:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    name: "Google Pixel 8 Pro",
    price: 899,
    category: "phones",
    description:
      "Das smarte Google-Phone mit Tensor G3 Chip, branchenführender KI-Fotografie und 7 Jahren Software-Updates.",
    image_url:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-4",
    name: "iPhone 14",
    price: 699,
    category: "phones",
    description:
      "Leistungsstarkes iPhone mit A15 Bionic Chip, fortschrittlichem Dual-Kamera-System und ganztägiger Akkulaufzeit. Perfektes Preis-Leistungs-Verhältnis.",
    image_url:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-5",
    name: "Samsung Galaxy A54",
    price: 449,
    category: "phones",
    description:
      "Samsungs beliebtes Mittelklasse-Smartphone mit AMOLED-Display, Triple-Kamera und wassergeschütztem Gehäuse.",
    image_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-6",
    name: "Apple AirPods Pro 2",
    price: 279,
    category: "accessories",
    description:
      "Premium In-Ear-Kopfhörer mit aktiver Geräuschunterdrückung, adaptiver Transparenz und personalisiertem 3D-Audio.",
    image_url:
      "https://images.unsplash.com/photo-1588423771073-b8903fdes564?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-7",
    name: "MagSafe Ladegerät",
    price: 49,
    category: "accessories",
    description:
      "Kabelloses Ladegerät mit perfekter magnetischer Ausrichtung für alle iPhone 12 und neuer. Schnelles und bequemes Laden.",
    image_url:
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-8",
    name: "Samsung Galaxy Buds2 Pro",
    price: 179,
    category: "accessories",
    description:
      "Hi-Fi-Ohrhörer mit intelligentem ANC, 360-Audio und nahtloser Galaxy-Integration. Kristallklarer Sound den ganzen Tag.",
    image_url:
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80",
    created_at: new Date().toISOString(),
  },
];

export const sampleRepairs: RepairService[] = [
  {
    id: "repair-1",
    name: "Display-Reparatur",
    price: 89,
    estimated_time: "30-60 Min",
    description:
      "Professioneller Austausch von gebrochenen oder beschädigten Displays für alle gängigen Smartphone-Modelle. Original-Qualität garantiert.",
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-2",
    name: "Akku-Austausch",
    price: 59,
    estimated_time: "20-40 Min",
    description:
      "Neuer Akku für mehr Laufzeit. Wir verwenden hochwertige Ersatzakkus mit voller Kapazität und Garantie.",
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-3",
    name: "Wasserschaden-Behandlung",
    price: 79,
    estimated_time: "2-24 Std",
    description:
      "Spezialreinigung und Trocknung bei Wasserschäden. Schnelles Handeln erhöht die Erfolgschancen erheblich.",
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-4",
    name: "Ladeanschluss-Reparatur",
    price: 69,
    estimated_time: "30-60 Min",
    description:
      "Reparatur oder Austausch defekter Ladebuchsen (USB-C / Lightning). Wieder zuverlässig laden.",
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-5",
    name: "Rückglas-Austausch",
    price: 99,
    estimated_time: "45-90 Min",
    description:
      "Professioneller Austausch des rückseitigen Glases bei iPhone und Samsung Galaxy Modellen. Wie neu.",
    created_at: new Date().toISOString(),
  },
  {
    id: "repair-6",
    name: "Kamera-Reparatur",
    price: 89,
    estimated_time: "30-60 Min",
    description:
      "Austausch defekter Front- oder Rückkameras. Scharfe Fotos und Videos wie am ersten Tag.",
    created_at: new Date().toISOString(),
  },
];
