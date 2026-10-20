/**
 * INEJ STUDIOS - Product Catalog Data
 * Collection 01: SOLITUDE
 * "Stillness Over Chaos"
 */

const PRODUCTS = [
  {
    id: "solitude-hoodie",
    slug: "solitude-heavyweight-hoodie",
    name: "Solitude Heavyweight Hoodie",
    tagline: "Stillness Over Chaos",
    collection: "SOLITUDE // DROP 01",
    category: "hoodies",
    categoryName: "Hoodies & Outerwear",
    priceLKR: 14500,
    priceUSD: 48,
    badge: "COLLECTION SIGNATURE",
    featured: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      "assets/images/hoodie-solitude.jpg",
      "assets/images/hoodie-solitude.jpg"
    ],
    primaryImage: "assets/images/hoodie-solitude.jpg",
    hoverImage: "assets/images/hoodie-solitude.jpg",
    color: "Obsidian Black",
    colorHex: "#0D0D0E",
    gsm: "480 GSM",
    composition: "100% French Terry Heavy Combed Cotton",
    fit: "Oversized Silhouette / Dropped Shoulder",
    description: "An architectural garment crafted from our bespoke 480 GSM French Terry cotton. Engineered for ultimate weight, structure, and insulation. Features a double-lined ergonomic hood, seamless dropped shoulders, ribbed hem & cuffs, and subtle high-density tonal 'ONCERES / INEJ' silicone branding. Made to envelop you in undisturbed solitude.",
    details: [
      "480 GSM heavy French Terry combed cotton",
      "Signature boxy, dropped-shoulder drape",
      "Seamless kangaroo pocket with reinforced bartacks",
      "Pre-shrunk to maintain exact silhouette wash after wash",
      "Custom woven Solitude internal labels"
    ],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 2 },
      { size: "XXL", stock: 3 }
    ],
    measurements: {
      chest: { S: "122 cm", M: "128 cm", L: "134 cm", XL: "140 cm", XXL: "146 cm" },
      length: { S: "69 cm", M: "71 cm", L: "73 cm", XL: "75 cm", XXL: "77 cm" },
      sleeve: { S: "60 cm", M: "61 cm", L: "62 cm", XL: "63 cm", XXL: "64 cm" }
    }
  },
  {
    id: "solitude-joggers",
    slug: "solitude-pleated-wide-joggers",
    name: "Solitude Wide-Leg Pleated Joggers",
    tagline: "Unisex Fluid Tailoring",
    collection: "SOLITUDE // DROP 01",
    category: "joggers",
    categoryName: "Pants & Joggers",
    priceLKR: 11800,
    priceUSD: 39,
    badge: "UNISEX ESSENTIAL",
    featured: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 44,
    images: [
      "assets/images/jogger-solitude-male.jpg",
      "assets/images/jogger-solitude-female.jpg"
    ],
    primaryImage: "assets/images/jogger-solitude-male.jpg",
    hoverImage: "assets/images/jogger-solitude-female.jpg",
    color: "Midnight Black",
    colorHex: "#0C0C0D",
    gsm: "420 GSM",
    composition: "100% Ultra-Soft Brushed Cotton Fleece",
    fit: "Wide-Leg Relaxed Cut / Floor Sweep",
    description: "Re-imagining sweatpants as luxury architectural tailoring. These wide-leg joggers feature tailored front pleats, an encased elastic waistband with chunky tonal drawstrings, and subtle tonal matte embroidery of 'SOLITUDE' along the upper thigh. Cut for a relaxed, fluid drape that falls perfectly over sneakers or slides.",
    details: [
      "420 GSM ultra-soft brushed interior cotton fleece",
      "Deep tailored front pleats for an elegant drape",
      "Thick elasticated ribbed waistband with metal aglet drawstrings",
      "Two deep front trouser pockets + concealed zip back pocket",
      "Subtle tonal matte 'SOLITUDE' thigh embroidery"
    ],
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 9 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 3 }
    ],
    measurements: {
      waist: { S: "72-82 cm", M: "78-88 cm", L: "84-94 cm", XL: "90-100 cm" },
      length: { S: "105 cm", M: "107 cm", L: "109 cm", XL: "111 cm" },
      thigh: { S: "68 cm", M: "71 cm", L: "74 cm", XL: "77 cm" }
    }
  },
  {
    id: "solitude-tee",
    slug: "solitude-vintage-wash-tee",
    name: "Solitude Acid-Wash Oversized Tee",
    tagline: "Where Silence Speaks Louder Than Words",
    collection: "SOLITUDE // DROP 01",
    category: "tees",
    categoryName: "Tees & Tops",
    priceLKR: 7900,
    priceUSD: 26,
    badge: "BESTSELLER",
    featured: true,
    isNew: true,
    rating: 4.95,
    reviewsCount: 62,
    images: [
      "assets/images/tee-solitude.jpg",
      "assets/images/tee-solitude.jpg"
    ],
    primaryImage: "assets/images/tee-solitude.jpg",
    hoverImage: "assets/images/tee-solitude.jpg",
    color: "Washed Carbon Black",
    colorHex: "#1B1B1C",
    gsm: "280 GSM",
    composition: "100% Vintage Acid-Washed Combed Cotton",
    fit: "Boxy Oversized Fit / Thick Neckband",
    description: "The manifesto statement of the collection. Constructed from heavyweight 280 GSM cotton treated with a bespoke stone-wash finish for a broken-in vintage texture. Features the iconic typography screenprint across the back: 'STILLNESS OVER CHAOS // SOLITUDE // where silence speaks louder than words and the soul finds its truest self // INEJ'.",
    details: [
      "280 GSM heavy-knit vintage washed combed cotton",
      "High-density discharge screenprint back manifesto",
      "3.2 cm thick reinforced 1x1 rib crew collar that never sags",
      "Dropped shoulders and elongated wide sleeves",
      "Hand-finished garment wash, making each piece unique"
    ],
    sizes: [
      { size: "S", stock: 7 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 },
      { size: "XXL", stock: 2 }
    ],
    measurements: {
      chest: { S: "116 cm", M: "122 cm", L: "128 cm", XL: "134 cm", XXL: "140 cm" },
      length: { S: "72 cm", M: "74 cm", L: "76 cm", XL: "78 cm", XXL: "80 cm" },
      shoulder: { S: "56 cm", M: "58 cm", L: "60 cm", XL: "62 cm", XXL: "64 cm" }
    }
  },
  {
    id: "solitude-armcut",
    slug: "solitude-raw-cut-muscle-tee",
    name: "Solitude Raw-Cut Muscle Armcut",
    tagline: "Bold Statement Silhouette",
    collection: "SOLITUDE // DROP 01",
    category: "tees",
    categoryName: "Tees & Tops",
    priceLKR: 6800,
    priceUSD: 23,
    badge: "LIMITED DROP",
    featured: true,
    isNew: true,
    rating: 4.85,
    reviewsCount: 29,
    images: [
      "assets/images/armcut-solitude.jpg",
      "assets/images/armcut-solitude.jpg"
    ],
    primaryImage: "assets/images/armcut-solitude.jpg",
    hoverImage: "assets/images/armcut-solitude.jpg",
    color: "Raw Bone White / Chalk",
    colorHex: "#ECEAE4",
    gsm: "260 GSM",
    composition: "100% Compact Spun Premium Cotton",
    fit: "Boxy Muscle Cut / Raw Rolled Armholes",
    description: "A commanding minimalist piece in raw bone white. Featuring rolled shoulder seams, raw-edge wide armholes, and the bold reflective-style high contrast 'SOLITUDE' statement print spanning the midriff, topped by 'stillness over chaos' at the upper chest. Cut for casual ease, gym-to-street versatility, and uncompromised presence.",
    details: [
      "260 GSM breathable compact cotton jersey",
      "Oversized 'SOLITUDE' architectural typography graphic",
      "Folded raw-edge armholes with reinforced lockstitch",
      "Split stepped hem for effortless layering and movement",
      "Exclusive chalk white colorway"
    ],
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 7 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 2 }
    ],
    measurements: {
      chest: { S: "112 cm", M: "118 cm", L: "124 cm", XL: "130 cm" },
      length: { S: "70 cm", M: "72 cm", L: "74 cm", XL: "76 cm" },
      armhole: { S: "30 cm", M: "32 cm", L: "34 cm", XL: "36 cm" }
    }
  }
];

// Helper functions for easy access
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id || p.slug === id) || PRODUCTS[0];
}

function getAllProducts() {
  return PRODUCTS;
}

function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured);
}
