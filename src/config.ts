/* ============================================================
   SHOP CONFIGURATION — Single source of truth
   ============================================================
   Edit these values to customize the template for any shop.
   Some values can also be overridden from the admin panel
   (stored in Supabase shop_config table).
   ============================================================ */

export const siteConfig = {
  // ─── Branding ────────────────────────────────────────────
  shopName: "MobileHub",
  tagline: "Your Trusted Mobile Phone Specialists",
  logoUrl: "/images/logo.png",

  // ─── Contact ─────────────────────────────────────────────
  phone: "+44 7700 900123",
  whatsapp: "447700900123",
  email: "hello@mobilehub.com",
  address: "123 High Street, London, EC1A 1BB",

  // ─── Google Maps ─────────────────────────────────────────
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.542339!2d-0.0877321!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjYiTiAwwrAwNScxNS44Ilc!5e0!3m2!1sen!2suk!4v1700000000000",

  // ─── Colours ─────────────────────────────────────────────
  primaryColor: "#f97316",
  primaryColorDark: "#ea580c",
  primaryColorLight: "#fb923c",

  // ─── Hero ────────────────────────────────────────────────
  heroBackgroundImage:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop",

  // ─── Opening Hours ───────────────────────────────────────
  openingHours: [
    { day: "Monday", hours: "9:00 AM – 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM – 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM – 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM – 7:00 PM" },
    { day: "Friday", hours: "9:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM – 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],

  // ─── Services (static) ──────────────────────────────────
  services: [
    {
      title: "Phone Repair",
      description:
        "Screen replacements, battery swaps, water damage recovery and more.",
      icon: "wrench" as const,
    },
    {
      title: "Phone Sales",
      description:
        "Brand-new and certified pre-owned smartphones at competitive prices.",
      icon: "smartphone" as const,
    },
    {
      title: "Accessories",
      description:
        "Cases, tempered glass, chargers, earphones, power banks — everything you need.",
      icon: "headphones" as const,
    },
    {
      title: "SIM Cards & Unlocking",
      description:
        "SIM-only deals, pay-as-you-go SIMs, and professional phone unlocking.",
      icon: "sim" as const,
    },
  ],

  // ─── Reviews (placeholder) ──────────────────────────────
  reviews: [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Brilliant service! Had my screen replaced in under an hour. Prices are very fair and the staff are super friendly.",
    },
    {
      name: "James K.",
      rating: 5,
      text: "Bought a refurbished iPhone here — works like new. They even threw in a free case. Highly recommend!",
    },
    {
      name: "Priya D.",
      rating: 5,
      text: "Best phone shop in town. Quick unlocking service and great advice on which phone to buy. Five stars!",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
export const whatsappLink = `https://wa.me/${siteConfig.whatsapp}`;
export const phoneLink = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
