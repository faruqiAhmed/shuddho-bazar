import { Category, Product, Review } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Products',
    bengaliName: 'সকল পণ্য',
    slug: 'all',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: 'Explore our full collection of fresh, 100% natural, lab-tested pantry items.',
    itemCount: 16,
    badge: 'Popular',
  },
  {
    id: 'honey',
    name: 'Raw Honey',
    bengaliName: 'খাঁটি মধু',
    slug: 'honey',
    iconName: 'Amber',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'Directly sourced wild forest and floral raw honeys with zero sugar adulteration.',
    itemCount: 4,
    badge: '100% Raw',
  },
  {
    id: 'oils',
    name: 'Cold-Pressed Oils',
    bengaliName: 'ঘানির খাঁটি তেল',
    slug: 'oils',
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional wooden cold-press (কাঠের ঘানি) oils keeping all natural nutrients intact.',
    itemCount: 4,
    badge: 'Wood Pressed',
  },
  {
    id: 'ghee',
    name: 'Pure Deshi Ghee',
    bengaliName: 'গাওয়া ঘি ও বাটার',
    slug: 'ghee',
    iconName: 'Milk',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-churned grass-fed cow milk bilona ghee with irresistible granular aroma.',
    itemCount: 3,
    badge: 'A2 Cow Milk',
  },
  {
    id: 'nuts',
    name: 'Nuts & Dry Fruits',
    bengaliName: 'ড্রাই ফ্রুটস ও বাদাম',
    slug: 'nuts',
    iconName: 'Nut',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    description: 'Handpicked California almonds, Afghan walnuts, whole cashews, and golden raisins.',
    itemCount: 5,
    badge: 'Premium',
  },
  {
    id: 'seeds',
    name: 'Seeds & Superfoods',
    bengaliName: 'সুপারফুড ও ভেষজ বীজ',
    slug: 'seeds',
    iconName: 'Wheat',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Organic chia seeds, black cumin seeds, pumpkin seeds, and natural flaxseeds.',
    itemCount: 4,
  },
  {
    id: 'spices',
    name: 'Pure Spices',
    bengaliName: 'খাঁটি দেশীয় মশলা',
    slug: 'spices',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    description: 'Sun-dried, stone-ground turmeric, red chili, cumin, and whole hill tract spices.',
    itemCount: 3,
  },
  {
    id: 'dates',
    name: 'Dates & Molasses',
    bengaliName: 'প্রিমিয়াম খেজুর ও গুড়',
    slug: 'dates',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic Medjool, Maryam dates, and winter date palm molasses (নলেন গুড়).',
    itemCount: 3,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sundarban Raw Khalisha Honey',
    bengaliName: 'সুন্দরবনের খাঁটি খলিশা ফুলের মধু',
    subtitle: '100% Unprocessed Wild Honey directly collected by traditional Mouals',
    category: 'Raw Honey',
    categoryId: 'honey',
    price: 1250,
    originalPrice: 1450,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 384,
    inStock: true,
    stockCount: 42,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Best Seller',
    weightOptions: [
      { label: '500g Jar', weight: '500g', price: 680, originalPrice: 780 },
      { label: '1kg Glass Bottle', weight: '1kg', price: 1250, originalPrice: 1450 },
      { label: '2kg Family Pack', weight: '2kg', price: 2400, originalPrice: 2800 }
    ],
    defaultWeight: '1kg',
    shortDescription: 'Unfiltered, unpasteurized wild flower honey packed with natural pollen, enzymes, and a delicate floral aroma.',
    fullDescription: 'Collected straight from the wild mangroves of Sundarbans during the blooming season of Khalisha flowers. Never heated, pasteurized, or blended with corn syrups. Packed in food-grade glass jars to preserve the delicate aroma and anti-bacterial active bio-enzymes.',
    benefits: [
      'Natural immunity and throat soothing booster',
      'Rich in active floral pollen, antioxidants & minerals',
      'Effective natural alternative to refined sugar',
      'Aids digestion and metabolic vitality'
    ],
    purityPoints: [
      'Zero added sucrose or glucose syrup',
      'Collected directly by certified forest gatherers',
      'Complete lab analysis report available on each batch'
    ],
    origin: 'Sundarban Mangrove Forest',
    unit: 'Bottle',
    isFlashDeal: true,
  },
  {
    id: 'p2',
    name: 'Wooden Ghani Cold-Pressed Mustard Oil',
    bengaliName: 'কাঠের ঘানিতে ভাঙা খাঁটি সরিষার তেল',
    subtitle: 'Extra Virgin cold-pressed mustard oil with pungent natural punch',
    category: 'Cold-Pressed Oils',
    categoryId: 'oils',
    price: 340,
    originalPrice: 390,
    discountPercent: 13,
    rating: 4.8,
    reviewCount: 520,
    inStock: true,
    stockCount: 65,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Wood Pressed',
    weightOptions: [
      { label: '1 Litre Bottle', weight: '1L', price: 340, originalPrice: 390 },
      { label: '2 Litre Family Can', weight: '2L', price: 660, originalPrice: 760 },
      { label: '5 Litre Jar', weight: '5L', price: 1600, originalPrice: 1850 }
    ],
    defaultWeight: '1L',
    shortDescription: 'Crushed slowly in authentic wooden ghani below 38°C to retain all natural pungency, vitamins, and antioxidants.',
    fullDescription: 'Prepared from prime yellow and brown mustard seeds grown on native fertile silt soils. Crushed at room temperature in traditional tamarind-wood ghani presses to ensure zero friction-heat damage. Experience the authentic spicy punch (ঝাঁঝ) in every Bengali bhorta and curry.',
    benefits: [
      'Abundant in monounsaturated healthy fats (MUFA)',
      'Natural antifungal and antibacterial properties',
      'Traditional culinary staple for spicy aromas',
      'Promotes healthy heart function'
    ],
    purityPoints: [
      '100% pure single-origin seed press',
      'No chemical refining, bleaching, or deodorizing',
      'Naturally sedimented and clear'
    ],
    origin: 'Pabna & Dinajpur Native Farms',
    unit: 'Bottle',
    isFlashDeal: true,
  },
  {
    id: 'p3',
    name: 'Artisanal Bilona Grass-Fed Cow Ghee',
    bengaliName: 'হাতে মন্থন করা খাঁটি গাওয়া ঘি',
    subtitle: 'Golden, aromatic, granular texture made using the ancient Bilona method',
    category: 'Pure Deshi Ghee',
    categoryId: 'ghee',
    price: 980,
    originalPrice: 1150,
    discountPercent: 15,
    rating: 5.0,
    reviewCount: 412,
    inStock: true,
    stockCount: 30,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80'
    ],
    badge: '100% Pure',
    weightOptions: [
      { label: '250g Jar', weight: '250g', price: 520, originalPrice: 620 },
      { label: '500g Jar', weight: '500g', price: 980, originalPrice: 1150 },
      { label: '1kg Glass Jar', weight: '1kg', price: 1900, originalPrice: 2250 }
    ],
    defaultWeight: '500g',
    shortDescription: 'Traditional slow-cooked curd-churned butter (মাখন) gently clarified into aromatic, nutty, granular golden ghee.',
    fullDescription: 'Made exclusively from free-range pastured cows milk. The milk is naturally cultured into rich curd, hand-churned in two-way wooden bilona to separate butter, and gently simmered on low wood embers until golden pearls of ghee form.',
    benefits: [
      'Rich in butyric acid supporting gut microbiome health',
      'High smoke point (250°C), ideal for safe cooking',
      'Natural source of fat-soluble Vitamins A, D, E, K2',
      'Lactose & casein safe due to slow clarifying process'
    ],
    purityPoints: [
      'Zero palm oil, dalda, or artificial coloring',
      'Granular danedaar texture guaranteed',
      'Tested for zero adulteration'
    ],
    origin: 'Sirajganj Dairy Basin',
    unit: 'Jar',
    isFlashDeal: false,
  },
  {
    id: 'p4',
    name: 'Royal Premium Mix Dry Fruits & Nuts',
    bengaliName: 'রয়্যাল মিক্সড ড্রাই ফ্রুটস ও বাদাম',
    subtitle: 'Jumbo Almonds, Cashews, Walnuts, Pistachios, Golden Raisins & Dried Figs',
    category: 'Nuts & Dry Fruits',
    categoryId: 'nuts',
    price: 780,
    originalPrice: 920,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 295,
    inStock: true,
    stockCount: 50,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508061252224-203a23004730?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Best Seller',
    weightOptions: [
      { label: '500g Airtight Pouch', weight: '500g', price: 780, originalPrice: 920 },
      { label: '1kg Gift Box', weight: '1kg', price: 1500, originalPrice: 1750 }
    ],
    defaultWeight: '500g',
    shortDescription: 'Balanced daily powerhouse of raw premium grade dry fruits and nuts selected for superior crunch and freshness.',
    fullDescription: 'Our premium dry fruit assortment contains California nonpareil almonds, buttery whole cashews (W320), high-altitude Afghan walnuts, Iranian roasted pistachios, sun-dried Turkish figs, and sweet golden kishmish.',
    benefits: [
      'Packed with plant protein, omega-3, and dietary fiber',
      'Maintains healthy brain activity and energy levels',
      'Guaranteed zero stale smell or rancidity'
    ],
    purityPoints: [
      'Nitrogen flushed vacuum sealed packing',
      'No added preservatives or artificial wax coatings'
    ],
    origin: 'Handpicked Global Imports',
    unit: 'Pouch',
    isFlashDeal: true,
  },
  {
    id: 'p5',
    name: 'Organic Virgin Black Cumin Seed Oil (Kalojira)',
    bengaliName: 'খাঁটি কাঠের ঘানির কালোজিরা তেল',
    subtitle: 'Known as the therapeutic remedy for wellness and resilience',
    category: 'Cold-Pressed Oils',
    categoryId: 'oils',
    price: 550,
    originalPrice: 650,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 189,
    inStock: true,
    stockCount: 38,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    badge: '100% Pure',
    weightOptions: [
      { label: '100ml Dropper Bottle', weight: '100ml', price: 250, originalPrice: 300 },
      { label: '250ml Glass Bottle', weight: '250ml', price: 550, originalPrice: 650 },
      { label: '500ml Family Bottle', weight: '500ml', price: 1050, originalPrice: 1250 }
    ],
    defaultWeight: '250ml',
    shortDescription: 'Single-pressed from pure Nigella Sativa seeds containing potent Thymoquinone for deep cellular wellness.',
    fullDescription: 'Cold-pressed under zero thermal stress in food-safe wooden ghani machines. Rich in bioactive thymoquinone, antioxidants, and essential fatty acids. Used traditionally for respiratory comfort, hair vitality, and daily wellness.',
    benefits: [
      'High concentrations of therapeutic Thymoquinone',
      'Supports healthy breathing and immune response',
      'Nourishes hair roots and scalp when massaged'
    ],
    purityPoints: [
      '100% virgin first-press without blending oils',
      'Unrefined and pesticide-free certified seeds'
    ],
    origin: 'Jessore Organic Cluster',
    unit: 'Bottle',
    isFlashDeal: false,
  },
  {
    id: 'p6',
    name: 'Premium USDA Organic Black Chia Seeds',
    bengaliName: 'প্রিমিয়াম অর্গানিক চিয়া সিড',
    subtitle: 'Triple-cleaned high dietary fiber and plant Omega-3 superfood',
    category: 'Seeds & Superfoods',
    categoryId: 'seeds',
    price: 450,
    originalPrice: 550,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    stockCount: 75,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    weightOptions: [
      { label: '250g Pouch', weight: '250g', price: 240, originalPrice: 290 },
      { label: '500g Zip Lock Jar', weight: '500g', price: 450, originalPrice: 550 },
      { label: '1kg Bulk Pack', weight: '1kg', price: 850, originalPrice: 1050 }
    ],
    defaultWeight: '500g',
    shortDescription: 'Nutrient-dense superseeds that absorb 10x their weight in water to provide sustained satiety and digestive comfort.',
    fullDescription: 'Sourced from organic high-altitude farms. Free from dust, sand, or debris thanks to advanced optical sorting. Ideal for morning detox water, yogurt parfaits, chia puddings, or oatmeal bowls.',
    benefits: [
      'Extremely high in soluble fiber and Omega-3 ALA',
      'Supports weight management through prolonged satiety',
      'Naturally gluten-free and low-glycemic index'
    ],
    purityPoints: [
      '99.9% purity grade, 100% organic',
      'Cleaned with modern air and laser separation'
    ],
    origin: 'Certified Organic Farms',
    unit: 'Jar',
    isFlashDeal: false,
  },
  {
    id: 'p7',
    name: 'Natural Chak Wildflower Comb Honey',
    bengaliName: 'প্রাকৃতিক চাকের তাজা মধু (ফুলের নির্যাস)',
    subtitle: 'Freshly gathered unfiltered comb honey with delicate floral sweetness',
    category: 'Raw Honey',
    categoryId: 'honey',
    price: 1150,
    originalPrice: 1350,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 164,
    inStock: true,
    stockCount: 22,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80'
    ],
    badge: '100% Pure',
    weightOptions: [
      { label: '500g Bottle', weight: '500g', price: 620, originalPrice: 720 },
      { label: '1kg Bottle', weight: '1kg', price: 1150, originalPrice: 1350 }
    ],
    defaultWeight: '1kg',
    shortDescription: 'Gathered during seasonal wildflower bloom across northern riverbanks. Golden, fragrant, and gentle on the palate.',
    fullDescription: 'Naturally sweet and gentle, this raw comb honey contains rich traces of beeswax micro-particles, royal jelly traces, and live probiotics. Never subjected to industrial boiling or pasteurizing.',
    benefits: [
      'Rich in beneficial polyphenols and flavonoids',
      'Soothes seasonal allergies and morning lethargy',
      'Children and elder-friendly sweet flavour'
    ],
    purityPoints: [
      'Tested for zero sugar adulteration (C3/C4 test pass)',
      'Directly bottled in hygienic sterilised glass'
    ],
    origin: 'Northern Rural Riverbanks',
    unit: 'Bottle',
    isFlashDeal: false,
  },
  {
    id: 'p8',
    name: 'Extra Virgin Wood-Pressed Coconut Oil',
    bengaliName: 'কাঠের ঘানির এক্সট্রা ভার্জিন নারিকেল তেল',
    subtitle: 'Edible and cosmetic pure oil extracted from sun-cured coconut copra',
    category: 'Cold-Pressed Oils',
    categoryId: 'oils',
    price: 480,
    originalPrice: 580,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    stockCount: 45,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Wood Pressed',
    weightOptions: [
      { label: '500ml Bottle', weight: '500ml', price: 260, originalPrice: 310 },
      { label: '1 Litre Bottle', weight: '1L', price: 480, originalPrice: 580 }
    ],
    defaultWeight: '1L',
    shortDescription: 'Silky crystal-clear coconut oil with sweet natural coconut scent. 100% edible and ideal for healthy cooking & hair care.',
    fullDescription: 'Crafted from hand-selected coastal coconuts. Cold-pressed strictly without sulfur, mineral oils, paraffin, or chemical perfumes. Liquifies into clear virgin oil at room temperature.',
    benefits: [
      'Rich in Lauric acid and Medium Chain Triglycerides (MCTs)',
      'Penetrates deep into hair follicles preventing hair breakage',
      'Ideal for gentle oil pulling and oral hygiene'
    ],
    purityPoints: [
      '100% edible food-grade standard',
      'Free from chemical fragrances and mineral oils'
    ],
    origin: 'Barisal Coastal Orchards',
    unit: 'Bottle',
    isFlashDeal: false,
  },
  {
    id: 'p9',
    name: 'Jumbo Royal Medjool & Maryam Dates',
    bengaliName: 'রয়্যাল মরিয়ম ও খেঁজুর প্রিমিয়াম বক্স',
    subtitle: 'Plump, naturally moist, caramel-like rich dates directly imported',
    category: 'Dates & Molasses',
    categoryId: 'dates',
    price: 1450,
    originalPrice: 1700,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 310,
    inStock: true,
    stockCount: 40,
    image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Premium',
    weightOptions: [
      { label: '500g Premium Box', weight: '500g', price: 750, originalPrice: 880 },
      { label: '1kg Gift Box', weight: '1kg', price: 1450, originalPrice: 1700 }
    ],
    defaultWeight: '1kg',
    shortDescription: 'Velvety texture with natural caramel notes. Rich in potassium, copper, magnesium, and dietary fiber.',
    fullDescription: 'Hand-picked from premium groves. Plump and fleshy with very small seeds. An essential natural stamina food for breakfast, fasting, and wholesome guilt-free snacks.',
    benefits: [
      'Instant natural stamina and glycogen replenishment',
      'High in potassium and blood-nourishing natural iron',
      'Zero added glucose or sugar glaze'
    ],
    purityPoints: [
      'No added syrup, preservatives, or artificial sheen',
      'Cleaned and packed under sanitary conditions'
    ],
    origin: 'Madinah & Middle Eastern Groves',
    unit: 'Box',
    isFlashDeal: true,
  },
  {
    id: 'p10',
    name: 'Traditional Winter Date Palm Molasses (Nolen Gur)',
    bengaliName: 'খাঁটি ঝোলা ও পাটালি নলেন গুড়',
    subtitle: 'Authentic seasonal date tree sap boiled down in brass cauldrons',
    category: 'Dates & Molasses',
    categoryId: 'dates',
    price: 380,
    originalPrice: 450,
    discountPercent: 16,
    rating: 5.0,
    reviewCount: 220,
    inStock: true,
    stockCount: 18,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    badge: '100% Pure',
    weightOptions: [
      { label: '500g Clay Pot', weight: '500g', price: 200, originalPrice: 240 },
      { label: '1kg Clay Pot Pack', weight: '1kg', price: 380, originalPrice: 450 }
    ],
    defaultWeight: '1kg',
    shortDescription: 'Mesmerizing winter aroma of authentic Nolen Gur. Made without any sugar or chemical brightening agents.',
    fullDescription: 'Tapped at dawn from date palm trees by skilled Gachhis. Simmered slowly in brass pans until it crystallizes into fragrant solid Patali or silky Jhola Gur. The heart and soul of traditional winter rice pudding (পায়েস) and pitha.',
    benefits: [
      'Free from chemical adulterants or sulfur refining',
      'Rich in natural iron and dietary minerals',
      'Iconic authentic winter fragrance'
    ],
    purityPoints: [
      '100% pure date sap reduction without table sugar',
      'Guaranteed authentic aroma'
    ],
    origin: 'Jessore Date Palm Groves',
    unit: 'Pot',
    isFlashDeal: false,
  },
  {
    id: 'p11',
    name: 'Stone-Ground Organic Turmeric & Chilli Spices Set',
    bengaliName: 'পাথরের জাঁতায় পেষা খাঁটি হলুদ ও মরিচ মশলা',
    subtitle: 'Sun-cured native rhizomes ground with high natural curcumin',
    category: 'Pure Spices',
    categoryId: 'spices',
    price: 320,
    originalPrice: 380,
    discountPercent: 16,
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockCount: 55,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    weightOptions: [
      { label: 'Combo Set (250g + 250g)', weight: '500g Set', price: 320, originalPrice: 380 },
      { label: 'Family Set (500g + 500g)', weight: '1kg Set', price: 600, originalPrice: 720 }
    ],
    defaultWeight: '500g Set',
    shortDescription: 'Zero brick dust, zero synthetic dyes (lead chromate-free). Pure golden aromatic spice pair.',
    fullDescription: 'Hand-sorted native turmeric rhizomes and red chillies sun-dried for days on reed mats and pulverized at low speed. Brings authentic vibrant color, aroma, and potent natural anti-inflammatory curcumin to your daily family cooking.',
    benefits: [
      'High natural curcumin content (over 4.5%)',
      'Certified lead chromate and artificial color free',
      'Deep, authentic aroma and lasting color in curries'
    ],
    purityPoints: [
      'Lab tested for lead and artificial dyes',
      'Pure single-origin farm spice crop'
    ],
    origin: 'Panchagarh Organic Fields',
    unit: 'Pack',
    isFlashDeal: false,
  },
  {
    id: 'p12',
    name: 'Pure Himalayan Fine Pink Rock Salt',
    bengaliName: 'হিমালয়ান পিংক সল্ট (খাঁটি খনিজ লবণ)',
    subtitle: 'Unrefined natural mineral salt with 84+ trace elements',
    category: 'Pure Spices',
    categoryId: 'spices',
    price: 180,
    originalPrice: 220,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 198,
    inStock: true,
    stockCount: 80,
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80'
    ],
    badge: '100% Pure',
    weightOptions: [
      { label: '500g Standup Pouch', weight: '500g', price: 100, originalPrice: 120 },
      { label: '1kg Glass Jar', weight: '1kg', price: 180, originalPrice: 220 }
    ],
    defaultWeight: '1kg',
    shortDescription: 'Mined from ancient unpolluted sea deposits. Free from microplastics and chemical anti-caking agents.',
    fullDescription: 'An exceptional culinary alternative to heavily processed table salt. Delivers clean, mellow salinity with natural electrolytes that support intracellular hydration.',
    benefits: [
      'Contains 84 essential minerals and trace elements',
      'Free from microplastics and synthetic anti-caking additives',
      'Balances body pH and cellular electrolytes'
    ],
    purityPoints: [
      '100% natural, unbleached, unrefined',
      'Food grade quality certificate'
    ],
    origin: 'Ancient Himalayan Mineral Formations',
    unit: 'Jar',
    isFlashDeal: false,
  },
  {
    id: 'p13',
    name: 'Raw Pumpkin & Sunflower Seeds Combo',
    bengaliName: 'অর্গানিক মিষ্টি কুমড়ার বীজ ও সূর্যমুখী বীজ',
    subtitle: 'Zinc and Magnesium rich crunchy roasted seeds duo',
    category: 'Seeds & Superfoods',
    categoryId: 'seeds',
    price: 480,
    originalPrice: 580,
    discountPercent: 17,
    rating: 4.8,
    reviewCount: 132,
    inStock: true,
    stockCount: 35,
    image: 'https://images.unsplash.com/photo-1508061252224-203a23004730?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508061252224-203a23004730?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    weightOptions: [
      { label: '250g Jar', weight: '250g', price: 260, originalPrice: 310 },
      { label: '500g Jar', weight: '500g', price: 480, originalPrice: 580 }
    ],
    defaultWeight: '500g',
    shortDescription: 'Crunchy, lightly unsalted superseeds brimming with natural zinc, magnesium, and tryptophan.',
    fullDescription: 'Cleaned and gently air-roasted without cooking oils. A delightful snack to keep at your work desk or sprinkle over morning porridge, salads, and smoothies.',
    benefits: [
      'High zinc content supporting immunity and prostate health',
      'Naturally rich in magnesium for peaceful sleep',
      'Heart-healthy plant fats and protein'
    ],
    purityPoints: [
      'Non-GMO verified seeds',
      'Zero artificial flavors or high-sodium seasonings'
    ],
    origin: 'Organic Harvest Farms',
    unit: 'Jar',
    isFlashDeal: false,
  },
  {
    id: 'p14',
    name: 'Artisanal Organic Green Tea with Holy Tulsi',
    bengaliName: 'সিলেটের বাগান থেকে অর্গানিক গ্রিন টি ও তুলসী',
    subtitle: 'Hand-plucked whole tea leaves infused with calming holy basil',
    category: 'Seeds & Superfoods',
    categoryId: 'seeds',
    price: 350,
    originalPrice: 420,
    discountPercent: 17,
    rating: 4.9,
    reviewCount: 110,
    inStock: true,
    stockCount: 48,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    weightOptions: [
      { label: '100g Tin Canister', weight: '100g', price: 160, originalPrice: 190 },
      { label: '250g Foil Pack', weight: '250g', price: 350, originalPrice: 420 }
    ],
    defaultWeight: '250g',
    shortDescription: 'Whole leaf green tea blended with purple Krishna Tulsi for a refreshing, stress-relieving brew.',
    fullDescription: 'Plucked from pristine tea gardens nestled along the misty slopes of Sreemangal. Naturally sun-withered and gently steamed to preserve vital catechins and EGCG antioxidants.',
    benefits: [
      'Potent EGCG antioxidant for metabolism and weight fitness',
      'Tulsi adaptogen helps combat daily work fatigue',
      'Pleasant clean aftertaste with zero harsh bitterness'
    ],
    purityPoints: [
      'Pesticide-free certified tea estate',
      'Whole unbroken tea leaves'
    ],
    origin: 'Sreemangal Tea Valleys',
    unit: 'Canister',
    isFlashDeal: false,
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Tanvir Ahmed',
    rating: 5,
    date: '2 days ago',
    comment: 'The Sundarban Khalisha honey is unmatched in aroma and genuine thickness. You can tell immediately it is raw and unheated. Excellent packaging too!',
    verifiedBuyer: true,
    productName: 'Sundarban Raw Khalisha Honey',
  },
  {
    id: 'r2',
    author: 'Nusrat Jahan',
    rating: 5,
    date: '3 days ago',
    comment: 'The wooden ghani mustard oil has the real spicy punch (ঝাঁঝ) we missed from our village childhood. Cooking with it brings the entire kitchen to life!',
    verifiedBuyer: true,
    productName: 'Wooden Ghani Cold-Pressed Mustard Oil',
  },
  {
    id: 'r3',
    author: 'Dr. Shahriar Kabir',
    rating: 5,
    date: '1 week ago',
    comment: 'The granular texture and buttery scent of this Bilona cow ghee is 100% authentic. Tested it thoroughly and will be a permanent subscriber for our family.',
    verifiedBuyer: true,
    productName: 'Artisanal Bilona Grass-Fed Cow Ghee',
  },
  {
    id: 'r4',
    author: 'Farhana Chowdhury',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Ordered via the Quick Buy button on my mobile phone. Delivery was completed next day and the nuts mix is completely fresh and crunchy!',
    verifiedBuyer: true,
    productName: 'Royal Premium Mix Dry Fruits & Nuts',
  }
];

export const SAMPLE_ORDERS: { [key: string]: { status: string; date: string; items: string; total: number; steps: { name: string; time: string; completed: boolean; current?: boolean }[] } } = {
  'SB-9241': {
    status: 'Out for Delivery',
    date: 'Today, 09:30 AM',
    items: 'Sundarban Raw Honey (1kg) + Cold-Pressed Mustard Oil (1L)',
    total: 1590,
    steps: [
      { name: 'Order Confirmed', time: 'Yesterday 04:15 PM', completed: true },
      { name: 'Purity Checked & Glass Packed', time: 'Yesterday 08:30 PM', completed: true },
      { name: 'Handed to Fast Courier', time: 'Today 06:40 AM', completed: true },
      { name: 'Out for Delivery by Rider', time: 'Today 09:15 AM', completed: true, current: true },
      { name: 'Delivered to Doorstep', time: 'Expected by 02:00 PM', completed: false }
    ]
  },
  'SB-8812': {
    status: 'Delivered',
    date: 'Sep 14, 2026',
    items: 'Artisanal Bilona Cow Ghee (500g) + Chia Seeds (500g)',
    total: 1430,
    steps: [
      { name: 'Order Confirmed', time: 'Sep 13 11:20 AM', completed: true },
      { name: 'Purity Checked & Glass Packed', time: 'Sep 13 03:10 PM', completed: true },
      { name: 'Handed to Fast Courier', time: 'Sep 14 08:00 AM', completed: true },
      { name: 'Out for Delivery', time: 'Sep 14 12:30 PM', completed: true },
      { name: 'Delivered to Doorstep', time: 'Sep 14 03:45 PM', completed: true }
    ]
  }
};
