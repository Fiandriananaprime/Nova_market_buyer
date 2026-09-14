// Nova Market — Malagasy Multi-Vendor Marketplace
// novamarket.mg | API v2.0

export type Page =
  | "home"
  | "search"
  | "product"
  | "category"
  | "cart"
  | "checkout"
  | "order-confirmation"
  | "order-tracking"
  | "account"
  | "orders"
  | "order-detail"
  | "wishlist"
  | "seller"
  | "comparison"
  | "returns"
  | "addresses"
  | "payment-methods"
  | "notifications"
  | "login"
  | "register"
  | "404";

export type Lang = "mg" | "fr" | "en";
export type Currency = "MGA" | "EUR" | "USD";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  MGA: "Ar",
  EUR: "€",
  USD: "$",
};

// Exchange rates (rough, for demo)
export const EXCHANGE_RATES: Record<Currency, number> = {
  MGA: 1,
  EUR: 0.00021,
  USD: 0.00022,
};

export function formatPrice(mga: number, currency: Currency): string {
  const rate = EXCHANGE_RATES[currency];
  const converted = mga * rate;
  const sym = CURRENCY_SYMBOLS[currency];
  if (currency === "MGA") {
    return `${sym} ${Math.round(mga).toLocaleString("fr-MG")}`;
  }
  return `${sym}${converted.toFixed(2)}`;
}

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  yearsActive: number;
  location: string;
  responseRate: number;
  productCount: number;
  followers: number;
  isOpen: boolean;
  isFollowedByCurrentUser: boolean;
  description?: string;
}

export interface ProductVariant {
  color?: string;
  size?: string;
  storage?: string;
}

export interface SellerOffer {
  seller: Seller;
  price: number;
  originalPrice: number;
  shipping: string;
  shippingCost: number;
  deliveryDays: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  nameF?: string; // French name
  brand: string;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  price: number; // in MGA
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  sold: number;
  badge?: string;
  sku: string;
  description: string;
  tags: string[];
  features: string[];
  specs: Record<string, string>;
  weightGrams?: number;
  dimensions?: string;
  seller: Seller;
  otherSellers: SellerOffer[];
  colors?: string[];
  sizes?: string[];
  storage?: string[];
  inStock: boolean;
  deliveryDays: number;
  freeShipping: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isDeal: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  selectedSeller: Seller;
  selectedPrice: number;
}

export const sellers: Seller[] = [
  {
    id: "s1",
    name: "TechNova Store",
    logo: "TN",
    rating: 4.9,
    reviewCount: 3241,
    verified: true,
    yearsActive: 5,
    location: "Antananarivo, Analamanga",
    responseRate: 98,
    productCount: 842,
    followers: 12400,
    isOpen: true,
    isFollowedByCurrentUser: false,
    description: "Spécialiste en électronique et high-tech à Antananarivo. Livraison rapide partout à Madagascar.",
  },
  {
    id: "s2",
    name: "AudioPro Madagascar",
    logo: "AP",
    rating: 4.7,
    reviewCount: 1543,
    verified: true,
    yearsActive: 3,
    location: "Toamasina, Atsinanana",
    responseRate: 95,
    productCount: 213,
    followers: 4800,
    isOpen: true,
    isFollowedByCurrentUser: true,
    description: "Tous vos besoins en audio et son. Vente et réparation.",
  },
  {
    id: "s3",
    name: "GadgetZone Mada",
    logo: "GZ",
    rating: 4.8,
    reviewCount: 921,
    verified: true,
    yearsActive: 4,
    location: "Fianarantsoa, Haute Matsiatra",
    responseRate: 97,
    productCount: 387,
    followers: 6200,
    isOpen: false,
    isFollowedByCurrentUser: false,
    description: "Gadgets et accessoires high-tech à prix compétitifs.",
  },
  {
    id: "s4",
    name: "Robes & Mode Mada",
    logo: "RM",
    rating: 4.6,
    reviewCount: 2104,
    verified: true,
    yearsActive: 6,
    location: "Antananarivo, Analamanga",
    responseRate: 94,
    productCount: 1240,
    followers: 18700,
    isOpen: true,
    isFollowedByCurrentUser: false,
    description: "Mode et vêtements locaux et importés. Livraison dans tout Madagascar.",
  },
  {
    id: "s5",
    name: "Maison Malgache",
    logo: "MM",
    rating: 4.8,
    reviewCount: 876,
    verified: true,
    yearsActive: 4,
    location: "Mahajanga, Boeny",
    responseRate: 96,
    productCount: 532,
    followers: 7900,
    isOpen: true,
    isFollowedByCurrentUser: false,
    description: "Décoration et mobilier de qualité. Artisanat malgache authentique.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Casque Sony WH-1000XM5 Sans Fil",
    nameF: "Casque Sony WH-1000XM5 Sans Fil",
    brand: "Sony",
    category: "Électronique",
    subcategory: "Casques Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1612858249937-1cc0852093dd?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1628329567705-f8f7150c3cff?w=600&h=600&fit=crop&auto=format",
    ],
    price: 1_280_000, // Ar 1,280,000 MGA
    originalPrice: 1_800_000,
    discount: 29,
    rating: 4.8,
    reviewCount: 847,
    sold: 2340,
    badge: "Meilleure vente",
    sku: "SNY-WH1000XM5-BLK",
    description: "Réduction de bruit de référence avec deux processeurs et huit microphones. Jusqu'à 30 heures d'autonomie avec charge rapide.",
    tags: ["casque", "sony", "bluetooth", "réduction de bruit"],
    features: [
      "Réduction de bruit active leader du marché",
      "30 heures d'autonomie",
      "Connexion multipoint Bluetooth 5.2",
      "Speak-to-chat automatique",
      "Capteurs tactiles",
      "Design pliable",
    ],
    specs: {
      Marque: "Sony",
      Modèle: "WH-1000XM5",
      Couleur: "Noir",
      "Taille de driver": "30mm",
      Poids: "250g",
      Autonomie: "30 heures",
      Connectivité: "Bluetooth 5.2",
      "Réduction de bruit": "Active (ANC)",
      Garantie: "1 an",
      "Pays d'origine": "Malaisie",
    },
    weightGrams: 250,
    dimensions: "19.4 × 16.5 × 8.9 cm",
    seller: sellers[0],
    otherSellers: [
      { seller: sellers[1], price: 1_250_000, originalPrice: 1_800_000, shipping: "Livraison gratuite", shippingCost: 0, deliveryDays: 4, stock: 14 },
      { seller: sellers[2], price: 1_310_000, originalPrice: 1_800_000, shipping: "Express 24h", shippingCost: 0, deliveryDays: 1, stock: 7 },
    ],
    colors: ["Noir", "Argent", "Bleu Minuit"],
    inStock: true,
    deliveryDays: 2,
    freeShipping: true,
    isNew: false,
    isBestSeller: true,
    isDeal: true,
  },
  {
    id: "p2",
    name: "MacBook Pro 14\" Puce M3 Pro — Noir Cosmos",
    nameF: "MacBook Pro 14 pouces M3 Pro",
    brand: "Apple",
    category: "Électronique",
    subcategory: "Ordinateurs Portables",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop&auto=format",
    ],
    price: 8_200_000,
    originalPrice: 9_100_000,
    discount: 10,
    rating: 4.9,
    reviewCount: 312,
    sold: 890,
    badge: "Top Choix",
    sku: "AAPL-MBP14-M3PRO-SB",
    description: "MacBook Pro avec puce M3 Pro pour des performances extraordinaires. Écran Liquid Retina XDR, jusqu'à 18 heures d'autonomie.",
    tags: ["macbook", "apple", "ordinateur portable", "m3"],
    features: [
      "Puce M3 Pro avec CPU 11 cœurs",
      "18 heures d'autonomie",
      "Écran 14,2\" Liquid Retina XDR",
      "18 Go de mémoire unifiée",
      "SSD 512 Go",
      "Trois ports Thunderbolt 4",
    ],
    specs: {
      Marque: "Apple",
      Modèle: "MacBook Pro 14 pouces (M3 Pro)",
      Couleur: "Noir Cosmos",
      CPU: "M3 Pro, 11 cœurs",
      RAM: "18 Go Mémoire Unifiée",
      Stockage: "512 Go SSD",
      Écran: "14,2\" Liquid Retina XDR",
      Autonomie: "18 heures",
      Poids: "1,61 kg",
      Garantie: "1 an Apple",
    },
    weightGrams: 1610,
    seller: sellers[0],
    otherSellers: [
      { seller: sellers[2], price: 8_450_000, originalPrice: 9_100_000, shipping: "Livraison gratuite", shippingCost: 0, deliveryDays: 3, stock: 5 },
    ],
    storage: ["512 Go", "1 To", "2 To"],
    colors: ["Noir Cosmos", "Argent"],
    inStock: true,
    deliveryDays: 2,
    freeShipping: true,
    isNew: false,
    isBestSeller: true,
    isDeal: false,
  },
  {
    id: "p3",
    name: "Samsung Galaxy S24 Ultra 5G — Noir Titanium",
    nameF: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    category: "Électronique",
    subcategory: "Smartphones",
    image: "https://images.unsplash.com/photo-1511140973288-19bf21d7e771?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1511140973288-19bf21d7e771?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1722834228772-01d16b9bf83b?w=600&h=600&fit=crop&auto=format",
    ],
    price: 5_100_000,
    originalPrice: 5_950_000,
    discount: 14,
    rating: 4.7,
    reviewCount: 621,
    sold: 1840,
    badge: "Nouveau",
    sku: "SAM-GS24U-256-TB",
    description: "Galaxy S24 Ultra avec Galaxy AI — le smartphone Galaxy le plus puissant. Stylet S Pen intégré, appareil photo 200 MP et châssis en titane.",
    tags: ["samsung", "galaxy", "smartphone", "5g", "s pen"],
    features: [
      "Appareil photo 200 MP",
      "Stylet S Pen intégré",
      "Châssis en titane",
      "Batterie 5 000 mAh",
      "Fonctions Galaxy AI",
      "Snapdragon 8 Gen 3",
    ],
    specs: {
      Marque: "Samsung",
      Modèle: "Galaxy S24 Ultra",
      Couleur: "Noir Titanium",
      Écran: "6,8\" QHD+ Dynamic AMOLED",
      Processeur: "Snapdragon 8 Gen 3",
      RAM: "12 Go",
      Stockage: "256 Go",
      "Appareil photo": "200 MP + 50 MP + 12 MP + 10 MP",
      Batterie: "5 000 mAh",
      Garantie: "1 an",
    },
    weightGrams: 232,
    seller: sellers[2],
    otherSellers: [
      { seller: sellers[0], price: 5_050_000, originalPrice: 5_950_000, shipping: "Livraison gratuite", shippingCost: 0, deliveryDays: 2, stock: 22 },
      { seller: sellers[1], price: 5_200_000, originalPrice: 5_950_000, shipping: "Express 24h", shippingCost: 0, deliveryDays: 1, stock: 8 },
    ],
    colors: ["Noir Titanium", "Gris Titanium", "Violet Titanium", "Jaune Titanium"],
    storage: ["256 Go", "512 Go", "1 To"],
    inStock: true,
    deliveryDays: 2,
    freeShipping: true,
    isNew: true,
    isBestSeller: false,
    isDeal: true,
  },
  {
    id: "p4",
    name: "Bose QuietComfort 45 — Casque Bluetooth",
    nameF: "Bose QuietComfort 45 Casque Sans Fil",
    brand: "Bose",
    category: "Électronique",
    subcategory: "Casques Audio",
    image: "https://images.unsplash.com/photo-1628329567705-f8f7150c3cff?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1628329567705-f8f7150c3cff?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?w=600&h=600&fit=crop&auto=format",
    ],
    price: 1_050_000,
    originalPrice: 1_490_000,
    discount: 30,
    rating: 4.6,
    reviewCount: 432,
    sold: 1240,
    badge: "Promo",
    sku: "BSE-QC45-WHT",
    description: "Réduction de bruit de classe mondiale avec système à trois microphones. Audio haute fidélité avec architecture acoustique TriPort.",
    tags: ["bose", "casque", "réduction de bruit", "bluetooth"],
    features: [
      "Réduction de bruit de classe mondiale",
      "24 heures d'autonomie",
      "Système à trois microphones",
      "Architecture acoustique TriPort",
      "Confort longue durée",
    ],
    specs: {
      Marque: "Bose",
      Modèle: "QuietComfort 45",
      Couleur: "Blanc Fumée",
      Poids: "238g",
      Autonomie: "24 heures",
      Connectivité: "Bluetooth 5.1",
      Garantie: "1 an",
    },
    weightGrams: 238,
    seller: sellers[1],
    otherSellers: [
      { seller: sellers[0], price: 1_080_000, originalPrice: 1_490_000, shipping: "Livraison gratuite", shippingCost: 0, deliveryDays: 2, stock: 18 },
    ],
    colors: ["Blanc Fumée", "Bleu Minuit"],
    inStock: true,
    deliveryDays: 3,
    freeShipping: true,
    isNew: false,
    isBestSeller: false,
    isDeal: true,
  },
  {
    id: "p5",
    name: "Chemise Oxford Slim Fit Premium",
    nameF: "Chemise Oxford Coupe Slim",
    brand: "Mode Malgache",
    category: "Mode",
    subcategory: "Vêtements Hommes",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop&auto=format",
    ],
    price: 95_000,
    originalPrice: 150_000,
    discount: 37,
    rating: 4.5,
    reviewCount: 187,
    sold: 423,
    sku: "MDM-OXSLIM-BLU-M",
    description: "Chemise Oxford classique coupe slim en 100 % coton premium. Un incontournable polyvalent qui passe du bureau au week-end sans effort.",
    tags: ["chemise", "mode", "coton", "homme"],
    features: [
      "100 % coton premium",
      "Coupe slim",
      "Col boutonné",
      "Poche poitrine",
      "Lavable en machine",
    ],
    specs: {
      Marque: "Mode Malgache",
      Matière: "100 % Coton",
      Coupe: "Slim Fit",
      Col: "Boutonné",
      Entretien: "Lavage à froid",
      "Pays d'origine": "Madagascar",
    },
    seller: sellers[3],
    otherSellers: [],
    colors: ["Blanc", "Bleu Clair", "Marine", "Gris"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    deliveryDays: 3,
    freeShipping: false,
    isNew: false,
    isBestSeller: false,
    isDeal: true,
  },
  {
    id: "p6",
    name: "Canapé Sectionnel Modulaire — Design Moderne",
    nameF: "Canapé Sectionnel Modulaire",
    brand: "Maison Malgache",
    category: "Maison & Déco",
    subcategory: "Canapés",
    image: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1688647063090-36f36f692d95?w=600&h=600&fit=crop&auto=format",
    ],
    price: 5_700_000,
    originalPrice: 7_200_000,
    discount: 21,
    rating: 4.7,
    reviewCount: 94,
    sold: 187,
    badge: "Meilleure vente",
    sku: "MM-SEC-MOD-GRY",
    description: "Canapé sectionnel modulaire luxueux avec assise profonde et revêtement en tissu premium. Configurez-le selon votre espace avec chaise longue réversible.",
    tags: ["canapé", "salon", "mobilier", "moderne"],
    features: [
      "Design modulaire en L",
      "Revêtement tissu premium",
      "Chaise longue réversible",
      "Cadre en bois massif",
      "Coussins en mousse haute densité",
    ],
    specs: {
      Marque: "Maison Malgache",
      Matière: "Mélange Polyester",
      Structure: "Bouleau Massif",
      Dimensions: "285 cm × 170 cm × 84 cm",
      Poids: "80 kg",
      Montage: "Requis",
      Garantie: "2 ans",
    },
    weightGrams: 80000,
    seller: sellers[4],
    otherSellers: [],
    colors: ["Gris Ardoise", "Beige Chaud", "Vert Forêt", "Marine"],
    inStock: true,
    deliveryDays: 7,
    freeShipping: true,
    isNew: false,
    isBestSeller: true,
    isDeal: false,
  },
  {
    id: "p7",
    name: "Dell XPS 15 — Intel Core i9, 32 Go RAM, 1 To SSD",
    nameF: "Dell XPS 15 Ordinateur Portable",
    brand: "Dell",
    category: "Électronique",
    subcategory: "Ordinateurs Portables",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&h=600&fit=crop&auto=format",
    ],
    price: 6_850_000,
    originalPrice: 8_200_000,
    discount: 16,
    rating: 4.6,
    reviewCount: 208,
    sold: 520,
    sku: "DLL-XPS15-I9-32-1T",
    description: "Le Dell XPS 15 offre des performances exceptionnelles dans un design élégant. Superbe écran OLED, processeur Intel Core i9 puissant et autonomie toute la journée.",
    tags: ["dell", "xps", "ordinateur portable", "gaming"],
    features: [
      "Écran OLED 15,6\" 3,5K",
      "Intel Core i9-13900H",
      "32 Go DDR5 RAM",
      "SSD NVMe 1 To",
      "NVIDIA GeForce RTX 4060",
      "Batterie 86 Wh",
    ],
    specs: {
      Marque: "Dell",
      Modèle: "XPS 15 9530",
      Écran: "15,6\" OLED 3,5K",
      CPU: "Intel Core i9-13900H",
      RAM: "32 Go DDR5",
      Stockage: "1 To PCIe NVMe",
      GPU: "NVIDIA GeForce RTX 4060 8 Go",
      Autonomie: "~10 heures",
      Poids: "1,86 kg",
      Garantie: "1 an",
    },
    weightGrams: 1860,
    seller: sellers[0],
    otherSellers: [
      { seller: sellers[2], price: 7_000_000, originalPrice: 8_200_000, shipping: "Livraison gratuite", shippingCost: 0, deliveryDays: 3, stock: 9 },
    ],
    inStock: true,
    deliveryDays: 2,
    freeShipping: true,
    isNew: false,
    isBestSeller: false,
    isDeal: false,
  },
  {
    id: "p8",
    name: "JBL Flip 6 Enceinte Bluetooth Portable — Waterproof",
    nameF: "JBL Flip 6 Enceinte Portable",
    brand: "JBL",
    category: "Électronique",
    subcategory: "Enceintes",
    image: "https://images.unsplash.com/photo-1612858249937-1cc0852093dd?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1612858249937-1cc0852093dd?w=600&h=600&fit=crop&auto=format",
    ],
    price: 460_000,
    originalPrice: 590_000,
    discount: 22,
    rating: 4.7,
    reviewCount: 389,
    sold: 1420,
    badge: "Top Choix",
    sku: "JBL-FLIP6-BLU",
    description: "Le JBL Flip 6 offre un son puissant avec des aigus clairs et des basses profondes. Résistant IP67, 12 heures d'autonomie.",
    tags: ["jbl", "enceinte", "bluetooth", "waterproof"],
    features: [
      "Résistant à l'eau et à la poussière IP67",
      "12 heures d'autonomie",
      "Basses puissantes avec double radiateur passif",
      "Compatible PartyBoost",
      "Charge USB-C",
    ],
    specs: {
      Marque: "JBL",
      Modèle: "Flip 6",
      Couleur: "Bleu",
      Poids: "550g",
      Autonomie: "12 heures",
      Connectivité: "Bluetooth 5.1",
      "Résistance à l'eau": "IP67",
      Garantie: "1 an",
    },
    weightGrams: 550,
    seller: sellers[1],
    otherSellers: [
      { seller: sellers[0], price: 475_000, originalPrice: 590_000, shipping: "Livraison gratuite", shippingCost: 0, deliveryDays: 2, stock: 35 },
    ],
    colors: ["Bleu", "Noir", "Rouge", "Sarcelle", "Camouflage"],
    inStock: true,
    deliveryDays: 2,
    freeShipping: true,
    isNew: false,
    isBestSeller: true,
    isDeal: false,
  },
];

export const categories = [
  { id: "electronique", name: "Électronique", icon: "💻", color: "#dbeafe", count: 12400 },
  { id: "mode", name: "Mode", icon: "👗", color: "#fce7f3", count: 23800 },
  { id: "maison", name: "Maison & Déco", icon: "🏠", color: "#dcfce7", count: 8700 },
  { id: "beaute", name: "Beauté", icon: "💄", color: "#fef3c7", count: 6200 },
  { id: "sports", name: "Sports & Loisirs", icon: "⚽", color: "#e0e7ff", count: 4800 },
  { id: "alimentation", name: "Alimentation", icon: "🍚", color: "#d1fae5", count: 3100 },
  { id: "livres", name: "Livres & Scolaire", icon: "📚", color: "#fef9c3", count: 2400 },
  { id: "auto", name: "Auto & Moto", icon: "🚗", color: "#fee2e2", count: 3900 },
  { id: "jouets", name: "Jouets & Jeux", icon: "🎮", color: "#ede9fe", count: 5200 },
  { id: "sante", name: "Santé", icon: "💊", color: "#ccfbf1", count: 2800 },
  { id: "animaux", name: "Animaux", icon: "🐾", color: "#fef9c3", count: 1900 },
  { id: "bureau", name: "Bureau & Papeterie", icon: "🖨️", color: "#f1f5f9", count: 2900 },
];

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  variant?: string;
}

export const reviews: Review[] = [
  {
    id: "r1",
    user: "Rakoto A.",
    avatar: "RA",
    rating: 5,
    title: "Meilleur casque que j'aie jamais eu",
    body: "Je voyage souvent pour le travail et ces casques sont absolument incroyables. La réduction de bruit est parfaite. La qualité sonore est superbe — basses chaudes, médiums clairs, aigus nets. La batterie dure tout le voyage. Je recommande vivement.",
    date: "12 nov. 2024",
    verified: true,
    helpful: 42,
    variant: "Noir",
  },
  {
    id: "r2",
    user: "Rabe M.",
    avatar: "RM",
    rating: 5,
    title: "Dépassé toutes mes attentes",
    body: "J'étais sceptique sur le prix mais ils valent chaque ariary. Le ANC est phénoménal et la qualité audio lors de l'écoute de musique est de niveau audiophile. Très confortables pour de longues sessions.",
    date: "28 oct. 2024",
    verified: true,
    helpful: 31,
    variant: "Argent",
  },
  {
    id: "r3",
    user: "Razafy N.",
    avatar: "RN",
    rating: 4,
    title: "Excellent casque, légèrement serré",
    body: "La qualité sonore et l'ANC sont au top. Mon seul bémol est qu'ils serrent un peu après quelques heures. Pas rédhibitoire — juste quelque chose à savoir si vous avez une grande tête. La connexion multipoint fonctionne parfaitement.",
    date: "15 oct. 2024",
    verified: true,
    helpful: 18,
    variant: "Noir",
  },
  {
    id: "r4",
    user: "Rasolofo H.",
    avatar: "RH",
    rating: 5,
    title: "Parfait pour le télétravail",
    body: "Ces casques ont transformé mon expérience de télétravail. Je peux me concentrer sans distraction, et la qualité des appels en visioconférence est cristalline. La fonction speak-to-chat est brillante.",
    date: "30 sep. 2024",
    verified: true,
    helpful: 14,
    variant: "Bleu Minuit",
  },
];

export const qaItems = [
  {
    id: "q1",
    question: "Fonctionne-t-il avec iPhone et Android ?",
    answer: "Oui, le WH-1000XM5 se connecte via Bluetooth 5.2 et fonctionne avec tout appareil Bluetooth, y compris iPhone et Android. L'application Sony Headphones Connect est disponible sur iOS et Android.",
    askedBy: "Andriamaro K.",
    answeredBy: "TechNova Store",
    isSeller: true,
    helpful: 24,
    date: "5 oct. 2024",
  },
  {
    id: "q2",
    question: "Combien de temps pour la charge complète ?",
    answer: "Le WH-1000XM5 se charge complètement en environ 3,5 heures via USB-C. Avec la charge rapide, 3 minutes de charge donnent 3 heures de lecture.",
    askedBy: "Ratsimba L.",
    answeredBy: "AudioPro Madagascar",
    isSeller: true,
    helpful: 17,
    date: "22 sep. 2024",
  },
];

export const orderStatuses = ["placed", "confirmed", "preparing", "shipped", "in-transit", "out-for-delivery", "delivered"] as const;

export const malagasyRegions = [
  "Analamanga", "Vakinankaratra", "Itasy", "Bongolava",
  "Haute Matsiatra", "Amoron'i Mania", "Vatovavy", "Fitovinany",
  "Ihorombe", "Atsimo-Atsinanana", "Atsinanana", "Analanjirofo",
  "Alaotra-Mangoro", "Boeny", "Sofia", "Betsiboka", "Melaky",
  "Atsimo-Andrefana", "Androy", "Anosy", "Menabe", "Diana", "Sava",
];

export const mockOrder = {
  id: "ORD-2024-884712",
  date: "20 nov. 2024",
  estimatedDelivery: "22 nov. 2024",
  status: "in-transit" as typeof orderStatuses[number],
  trackingNumber: "NVM-2024-884712-001",
  carrier: "Colissimo Madagascar",
  currentLocation: "Dépôt Ivandry, Antananarivo",
  items: [
    { product: products[0], quantity: 1, price: 1_280_000, seller: sellers[0] },
    { product: products[7], quantity: 2, price: 460_000, seller: sellers[1] },
  ],
  shipping: 0,
  tax: 0, // TVA incluse à Madagascar
  total: 2_200_000,
  address: {
    name: "Rakoto Andry",
    line1: "Lot II A 34 Ankorondrano",
    city: "Antananarivo",
    district: "Antananarivo Renivohitra",
    region: "Analamanga",
    zip: "101",
    country: "Madagascar",
  },
};
