const seedAdminUsers = [
  {
    username: "admin",
    password: "maxplus123",
    role: "super-admin"
  },
  {
    username: "operator.max",
    password: "maxplus123",
    role: "operator"
  },
  {
    username: "support.max",
    password: "maxplus123",
    role: "support"
  }
];

const seedSiteSettings = {
  brand: {
    brandName: "MaxPlus Sporting Goods",
    siteTitle: "MaxPlus Sporting Goods",
    siteDescription: "Sporting goods brand site for products, tutorials, wholesale, and SEO growth.",
    supportEmail: "support@maxplus-sport.com",
    salesEmail: "hello@maxplus-sport.com",
    phone: "+1 (800) 555-0199",
    whatsapp: "+1 800 555 0199",
    defaultLanguage: "English",
    defaultCurrency: "USD",
    timezone: "America/Los_Angeles",
    address: "Los Angeles, California, United States"
  },
  socials: [
    { name: "Instagram", url: "https://instagram.com/maxplus" },
    { name: "YouTube", url: "https://youtube.com/maxplus" },
    { name: "TikTok", url: "https://tiktok.com/@maxplus" }
  ],
  notifications: {
    inquiryRecipients: "sales@maxplus-sport.com, ops@maxplus-sport.com",
    subscriberRecipients: "crm@maxplus-sport.com",
    enableEmailNotice: true,
    enableSlackNotice: false
  },
  footer: {
    text:
      "Sporting goods brand site with category depth, product detail pages, tutorial content, and wholesale inquiry paths.",
    quickLinks: [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/videos", label: "Videos" },
      { href: "/blog", label: "Blog" }
    ],
    policyLinks: [
      { href: "/policy/privacy", label: "Privacy Policy" },
      { href: "/policy/terms", label: "Terms" }
    ],
    meta1: "© 2026 MaxPlus Sporting Goods. All rights reserved.",
    meta2: "Built for catalog display, wholesale leads, and content growth."
  }
};

const seedHomeContent = {
  heroSlides: [
    {
      id: "hero-1",
      title: "Sporting Goods That Look Ready To Move",
      subtitle: "Homepage hero for product and wholesale traffic.",
      targetUrl: "/products",
      imageUrl: "/images/hero-training.svg",
      enabled: true
    },
    {
      id: "hero-2",
      title: "Modern Layout With Product Depth",
      subtitle: "Second hero slide for category and SEO expansion.",
      targetUrl: "/videos",
      imageUrl: "/images/hero-performance.svg",
      enabled: true
    },
    {
      id: "hero-3",
      title: "Built For Clubs, Camps, Retail, And Family Use",
      subtitle: "Third hero slide for broader brand positioning.",
      targetUrl: "/buy",
      imageUrl: "/images/hero-recreation.svg",
      enabled: true
    }
  ],
  highlights: [
    "Multi-category catalog",
    "Wholesale-ready inquiry flow",
    "Video content support",
    "SEO-first content structure"
  ],
  featuredProductSlugs: [
    "portable-volleyball-net-kit",
    "agility-cone-ladder-set",
    "resistance-band-pack",
    "match-ball-pack"
  ],
  featuredVideoSlugs: ["portable-volleyball-net-setup", "cone-drill-station"],
  reviews: {
    eyebrow: "Partner Feedback",
    title: "Reviews",
    text: "Feedback content can be switched between text-only cards and avatar-supported cards.",
    displayMode: "text",
    summary: {
      label: "Average sentiment from early review rounds",
      value: "4.8/5",
      detail: "Review data is now editable from the admin console.",
      metrics: [
        { value: "92%", label: "felt the site looked established" },
        { value: "3/3", label: "mentioned product clarity" },
        { value: "Fast Read", label: "more credible first read" }
      ]
    },
    items: [
      {
        id: "review-1",
        quote: "The brand block feels like a real company introduction, not a placeholder.",
        rating: 5,
        author: "Anna Reed",
        meta: "Retail Buyer",
        imageUrl: ""
      },
      {
        id: "review-2",
        quote: "The review cards make the page feel closer to a launch-ready brand site.",
        rating: 5,
        author: "Marcus Hill",
        meta: "Club Program Lead",
        imageUrl: ""
      },
      {
        id: "review-3",
        quote: "Brand story and product depth now sit in the right order for quick evaluation.",
        rating: 4,
        author: "Sophie Chen",
        meta: "Ecommerce Manager",
        imageUrl: ""
      }
    ]
  },
  sectionToggles: [
    { key: "hero", label: "首屏轮播", enabled: true },
    { key: "videos", label: "视频模块", enabled: true },
    { key: "products", label: "精选商品", enabled: true },
    { key: "reviews", label: "评价模块", enabled: true },
    { key: "contact", label: "联系模块", enabled: true }
  ]
};

const seedCategories = [
  {
    id: "cat-1",
    name: "Team Sports",
    slug: "team-sports",
    parent: "顶级分类",
    sortOrder: 1,
    enabled: true,
    seoTitle: "Team Sports Equipment",
    summary: "Portable game-day gear for clubs, schools, camps, and community leagues.",
    bannerTitle: "Team Sports",
    bannerText: "Portable systems, durable match gear, and easy-pack field essentials.",
    visualClass: "catalog-hero__visual--team",
    highlights: [
      "Portable nets for school gyms and outdoor courts",
      "Bulk-ready ball packs for clubs and recreation centers",
      "Fast setup for clinics, camps, and seasonal programs"
    ],
    stats: [
      { value: "12+", label: "club-friendly SKUs" },
      { value: "48h", label: "quote turnaround" },
      { value: "Low MOQs", label: "for trial orders" }
    ]
  },
  {
    id: "cat-2",
    name: "Training Gear",
    slug: "training-gear",
    parent: "顶级分类",
    sortOrder: 2,
    enabled: true,
    seoTitle: "Training Gear And Conditioning",
    summary: "Footwork, conditioning, and drill equipment built for daily repetition.",
    bannerTitle: "Training Gear",
    bannerText: "Agility kits, rebound tools, and coach-friendly sets for repeat sessions.",
    visualClass: "catalog-hero__visual--training",
    highlights: [
      "Compact kits for coaches and personal training studios",
      "Color-coded equipment that is easy to sort by session type",
      "Retail-friendly bundles for fast add-on sales"
    ],
    stats: [
      { value: "4 Core", label: "training families" },
      { value: "1 Box", label: "easy merchandising" },
      { value: "All Ages", label: "entry to club level" }
    ]
  },
  {
    id: "cat-3",
    name: "Outdoor Play",
    slug: "outdoor-play",
    parent: "顶级分类",
    sortOrder: 3,
    enabled: true,
    seoTitle: "Outdoor Play Products",
    summary: "Backyard, beach, and park products designed for fast setup and casual use.",
    bannerTitle: "Outdoor Play",
    bannerText: "Portable systems for active families, rental operators, and spring-summer retail.",
    visualClass: "catalog-hero__visual--outdoor",
    highlights: [
      "Easy-carry sets for picnic, beach, and yard use",
      "Spring and summer friendly assortment planning",
      "Simple assembly that reduces returns and support load"
    ],
    stats: [
      { value: "Spring/Summer", label: "peak browse season" },
      { value: "10 Min", label: "average setup" },
      { value: "Carry Bag", label: "included on key SKUs" }
    ]
  },
  {
    id: "cat-4",
    name: "Recovery",
    slug: "recovery",
    parent: "顶级分类",
    sortOrder: 4,
    enabled: true,
    seoTitle: "Recovery And Mobility Gear",
    summary: "Recovery tools and resistance products for mobility, warmup, and after-training care.",
    bannerTitle: "Recovery",
    bannerText: "Compact recovery tools that are easy to bundle with strength and team-sport lines.",
    visualClass: "catalog-hero__visual--recovery",
    highlights: [
      "High attach rate with team and training assortments",
      "Compact form factor for checkout and bundle offers",
      "Useful for retail, gyms, therapists, and studio programs"
    ],
    stats: [
      { value: "Bundle Ready", label: "high cross-sell fit" },
      { value: "Small Pack", label: "easy shelf placement" },
      { value: "Daily Use", label: "repeat engagement" }
    ]
  }
];

const seedVideoCategories = [
  {
    id: "vcat-parent-1",
    name: "Strength Training",
    slug: "strength-training",
    parentId: "",
    sortOrder: 1,
    enabled: true
  },
  {
    id: "vcat-parent-2",
    name: "Agility Training",
    slug: "agility-training",
    parentId: "",
    sortOrder: 2,
    enabled: true
  },
  {
    id: "vcat-parent-3",
    name: "Recovery Routines",
    slug: "recovery-routines",
    parentId: "",
    sortOrder: 3,
    enabled: true
  },
  {
    id: "vcat-parent-4",
    name: "Equipment Setup",
    slug: "equipment-setup",
    parentId: "",
    sortOrder: 4,
    enabled: true
  },
  {
    id: "vcat-1",
    name: "Push-Up",
    slug: "push-up",
    parentId: "vcat-parent-1",
    sortOrder: 1,
    enabled: true
  },
  {
    id: "vcat-2",
    name: "Squat",
    slug: "squat",
    parentId: "vcat-parent-1",
    sortOrder: 2,
    enabled: true
  },
  {
    id: "vcat-3",
    name: "Cone Footwork",
    slug: "cone-footwork",
    parentId: "vcat-parent-2",
    sortOrder: 1,
    enabled: true
  },
  {
    id: "vcat-4",
    name: "Ladder Steps",
    slug: "ladder-steps",
    parentId: "vcat-parent-2",
    sortOrder: 2,
    enabled: true
  },
  {
    id: "vcat-5",
    name: "Roller Reset",
    slug: "roller-reset",
    parentId: "vcat-parent-3",
    sortOrder: 1,
    enabled: true
  },
  {
    id: "vcat-6",
    name: "Stretching",
    slug: "stretching",
    parentId: "vcat-parent-3",
    sortOrder: 2,
    enabled: true
  },
  {
    id: "vcat-7",
    name: "Net Setup",
    slug: "net-setup",
    parentId: "vcat-parent-4",
    sortOrder: 1,
    enabled: true
  },
  {
    id: "vcat-8",
    name: "Court Layout",
    slug: "court-layout",
    parentId: "vcat-parent-4",
    sortOrder: 2,
    enabled: true
  }
];

const seedProducts = [
  {
    id: "prd-1",
    title: "Portable Volleyball Net Kit",
    slug: "portable-volleyball-net-kit",
    sku: "MP-VNET-2401",
    categoryId: "cat-1",
    price: 129,
    compareAtPrice: 149,
    stock: 180,
    weight: "7.4 kg",
    status: "published",
    tags: ["Best Seller", "Wholesale"],
    heroImage: "/images/net-kit-cover.png",
    gallery: ["/images/net-kit-1.png", "/images/net-kit-2.png"],
    summary: "Portable net set for clubs, camps, and family use.",
    description:
      "A launch-friendly court kit for clubs, camps, and active-family retail. The system packs down quickly and sets up with minimal tools.",
    tagLabel: "Best Seller",
    orderMinimum: "24 sets",
    leadTime: "12-15 business days",
    sportType: "Volleyball",
    audience: "Club / Family",
    useCase: "Outdoor Setup",
    visualClass: "product-card__visual--net",
    highlights: [
      "Adjustable width for practice and casual match setups",
      "Powder-coated poles and guided tension straps",
      "Carry bag sized for car trunk and sideline storage"
    ],
    specifications: [
      { label: "Frame", value: "Steel poles with powder coating" },
      { label: "Net Width", value: "Adjustable 10-20 ft" },
      { label: "Included", value: "Net, poles, stakes, bag" },
      { label: "Packaging", value: "1 master carton" }
    ],
    applications: ["Club clinics", "School PE", "Beach and yard play"],
    shipping:
      "Packed in a single reinforced carton with accessory pouch separation for cleaner unboxing.",
    support:
      "Replacement parts, setup video guidance, and wholesale quote support available on request.",
    relatedSlugs: ["match-ball-pack", "agility-cone-ladder-set"],
    featured: true,
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  },
  {
    id: "prd-2",
    title: "Agility Cone & Ladder Set",
    slug: "agility-cone-ladder-set",
    sku: "MP-AGIL-1108",
    categoryId: "cat-2",
    price: 49,
    compareAtPrice: 59,
    stock: 320,
    weight: "2.1 kg",
    status: "published",
    tags: ["Training"],
    heroImage: "/images/agility-cover.png",
    gallery: ["/images/agility-1.png"],
    summary: "Coach-friendly drill set for speed and footwork.",
    description:
      "A core training bundle built around fast session setup and compact storage for schools, camps, and retail entry lines.",
    tagLabel: "Training",
    orderMinimum: "48 sets",
    leadTime: "10-12 business days",
    sportType: "Multi-Sport",
    audience: "Coach / School",
    useCase: "Speed Training",
    visualClass: "product-card__visual--cones",
    highlights: [
      "Foldable ladder sections for compact pack-out",
      "Bright cone colors for drill visibility",
      "Suitable for youth, school, and entry club programs"
    ],
    specifications: [
      { label: "Ladder", value: "6 m adjustable ladder" },
      { label: "Cones", value: "20 flat marker cones" },
      { label: "Bag", value: "Mesh carry bag included" },
      { label: "Use", value: "Indoor and outdoor training" }
    ],
    applications: ["Soccer drills", "PE warmups", "Agility circuits"],
    shipping: "Ships flat with low cubic volume for efficient master-carton loading.",
    support: "Retail set-up guidance and bundle recommendations included for wholesale buyers.",
    relatedSlugs: ["portable-volleyball-net-kit", "resistance-band-pack"],
    featured: true,
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  },
  {
    id: "prd-3",
    title: "Resistance Band Pack",
    slug: "resistance-band-pack",
    sku: "MP-BAND-3304",
    categoryId: "cat-4",
    price: 34,
    compareAtPrice: 42,
    stock: 260,
    weight: "0.8 kg",
    status: "published",
    tags: ["Recovery"],
    heroImage: "/images/bands-cover.png",
    gallery: ["/images/bands-1.png"],
    summary: "Compact strength and mobility pack with multiple resistance levels.",
    description:
      "A compact band assortment aimed at recovery corners, home fitness shelves, and bundle promotions.",
    tagLabel: "Recovery",
    orderMinimum: "60 packs",
    leadTime: "8-10 business days",
    sportType: "Recovery",
    audience: "Retail / Studio",
    useCase: "Mobility",
    visualClass: "product-card__visual--bands",
    highlights: [
      "Color coding makes level selection easy for new users",
      "Small-footprint packaging works well for add-on sales",
      "Balanced for warmup, rehab-inspired movement, and light strength"
    ],
    specifications: [
      { label: "Band Levels", value: "Light / Medium / Heavy" },
      { label: "Material", value: "Latex blend with soft-touch finish" },
      { label: "Included", value: "3 loop bands + guide card" },
      { label: "Packaging", value: "Retail sleeve + inner bag" }
    ],
    applications: ["Warmup zones", "Pilates add-ons", "Home recovery routines"],
    shipping: "Ships in compact cartons with efficient shelf-ready inner packs.",
    support: "Branding adaptation and leaflet customization available for larger orders.",
    relatedSlugs: ["agility-cone-ladder-set"],
    featured: true,
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  },
  {
    id: "prd-4",
    title: "Match Ball Pack",
    slug: "match-ball-pack",
    sku: "MP-BALL-5602",
    categoryId: "cat-1",
    price: 79,
    compareAtPrice: 95,
    stock: 92,
    weight: "4.2 kg",
    status: "published",
    tags: ["Team Play"],
    heroImage: "/images/ball-pack-cover.png",
    gallery: ["/images/ball-pack-1.png"],
    summary: "Durable composite game balls for school, club, and backyard use.",
    description:
      "A multi-ball pack created for replenishment orders and seasonal retail promotions with higher perceived value than single-ball listings.",
    tagLabel: "Team Play",
    orderMinimum: "18 packs",
    leadTime: "7-10 business days",
    sportType: "Soccer / Volleyball",
    audience: "Club / School",
    useCase: "Match & Practice",
    visualClass: "product-card__visual--balls",
    highlights: [
      "Composite outer with balanced grip and visual pop",
      "Club-friendly pack size for repeat replenishment",
      "Useful for school programs, camps, and seasonal events"
    ],
    specifications: [
      { label: "Pack Size", value: "6 balls per set" },
      { label: "Outer", value: "Composite textured surface" },
      { label: "Use", value: "Indoor / Outdoor recreational use" },
      { label: "Included", value: "Inflation needle and care card" }
    ],
    applications: ["School inventory", "Camp issue packs", "Club replenishment"],
    shipping: "Outer cartons optimized for stack stability and mixed-pallet shipment.",
    support: "Custom logo print support available subject to MOQ and sample approval.",
    relatedSlugs: ["portable-volleyball-net-kit"],
    featured: true,
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  },
  {
    id: "prd-5",
    title: "Recovery Roller Kit",
    slug: "recovery-roller-kit",
    sku: "MP-ROLL-6101",
    categoryId: "cat-4",
    price: 44,
    compareAtPrice: 52,
    stock: 96,
    weight: "1.8 kg",
    status: "draft",
    tags: ["Recovery"],
    heroImage: "/images/roller-cover.png",
    gallery: [],
    summary: "Recovery kit for mobility and after-training care.",
    description: "Compact mobility routine gear built around the roller kit.",
    tagLabel: "Recovery",
    orderMinimum: "24 kits",
    leadTime: "10-14 business days",
    sportType: "Recovery",
    audience: "Gym / Retail",
    useCase: "After Training",
    visualClass: "product-card__visual--bands",
    highlights: ["Compact size", "Easy to bundle", "Supports after-training care"],
    specifications: [
      { label: "Material", value: "High-density foam" },
      { label: "Included", value: "Roller + guide card" }
    ],
    applications: ["Gym shelves", "Studio kits"],
    shipping: "Compact pack-out for easy mixed cartons.",
    support: "After-sales care guidance available.",
    relatedSlugs: ["resistance-band-pack"],
    featured: false,
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  }
];

const seedVideos = [
  {
    id: "vid-1",
    title: "How To Set Up The Portable Volleyball Net",
    slug: "portable-volleyball-net-setup",
    videoCategoryId: "vcat-7",
    duration: "03:42",
    status: "published",
    cover: "/images/video-net-cover.png",
    videoUrl: "https://videos.maxplus.local/portable-volleyball-net-setup",
    summary: "Setup walkthrough for clubs, camps, and family buyers.",
    tagLabel: "Setup",
    visualClass: "video-card__media--net",
    featured: true
  },
  {
    id: "vid-2",
    title: "Cone Drill Setup In 5 Minutes",
    slug: "cone-drill-station",
    videoCategoryId: "vcat-3",
    duration: "04:05",
    status: "published",
    cover: "/images/video-cone-cover.png",
    videoUrl: "https://videos.maxplus.local/cone-drill-station",
    summary: "Fast drill layout for PE and quick training sessions.",
    tagLabel: "Drills",
    visualClass: "video-card__media--cones",
    featured: false
  },
  {
    id: "vid-3",
    title: "Recovery Roller Reset Routine",
    slug: "roller-reset-routine",
    videoCategoryId: "vcat-5",
    duration: "03:14",
    status: "draft",
    cover: "/images/video-roller-cover.png",
    videoUrl: "https://videos.maxplus.local/roller-reset-routine",
    summary: "Compact mobility routine built around the roller kit.",
    tagLabel: "Routine",
    visualClass: "video-card__media--recovery",
    featured: false
  }
];

const seedBlogs = [
  {
    id: "blog-1",
    title: "How To Build A Better Backyard Practice Setup",
    slug: "better-backyard-practice-setup",
    category: "Training",
    author: "Operations Team",
    status: "published",
    publishDate: "2026-04-01",
    excerpt: "Portable nets, cones, and drill gear for home use.",
    body: [
      "Backyard training products work best when setup time stays short and product purpose is obvious.",
      "Portable systems, fast-fold goals, and simple drill kits usually outperform complex bundles in first-time purchases."
    ],
    meta: "Operations Team / 2026-04-01"
  },
  {
    id: "blog-2",
    title: "What Retailers Look For In Entry-Level Sports Gear",
    slug: "what-retailers-look-for-in-entry-level-sports-gear",
    category: "Buying Guide",
    author: "Brand Team",
    status: "draft",
    publishDate: "2026-04-02",
    excerpt: "Packaging, range depth, and product clarity for first-buy confidence.",
    body: [
      "For first orders, merchants often favor compact master cartons, simple demo visuals, and products that sit well beside team-sport, training, and outdoor assortments."
    ],
    meta: "Brand Team / 2026-04-02"
  }
];

const seedSeo = {
  globalTitle: "MaxPlus Sporting Goods",
  globalDescription: "Multi-page sporting goods site with products, videos, blog, and wholesale flow.",
  ogImage: "/images/maxplus-og.png",
  sitemapEnabled: true,
  robotsIndex: true,
  productTemplate: "{product} | MaxPlus Sporting Goods",
  categoryTemplate: "{category} | MaxPlus Categories",
  blogTemplate: "{post} | MaxPlus Blog"
};

const seedInquiries = [
  {
    id: "inq-1",
    source: "wholesale",
    customer: "Ryan Cooper",
    email: "ryan@fieldhouse.com",
    company: "Fieldhouse Supply",
    status: "new",
    assignee: "Unassigned",
    sourceDetail: "Contact / Wholesale",
    message: "Need quote for 80 portable net kits and 120 training sets.",
    createdAt: "2026-04-03 09:15:00"
  },
  {
    id: "inq-2",
    source: "product",
    customer: "Maria Wells",
    email: "maria@coastclub.com",
    company: "Coast Club",
    status: "processing",
    assignee: "Derek",
    sourceDetail: "Portable Volleyball Net Kit",
    message: "Interested in custom logo print for match ball packs.",
    createdAt: "2026-04-03 10:42:00"
  }
];

const seedSubscribers = [
  {
    id: "sub-1",
    email: "jane@example.com",
    source: "首页订阅弹窗",
    orderNumber: "MP-10021",
    createdAt: "2026-04-02 15:11:00"
  },
  {
    id: "sub-2",
    email: "coach@academy.org",
    source: "去购买页面",
    orderNumber: "MP-10045",
    createdAt: "2026-04-03 08:56:00"
  }
];

const seedLogs = [
  {
    id: "log-1",
    type: "login",
    actor: "admin",
    role: "super-admin",
    message: "从后台登录页进入系统。",
    metadata: null,
    createdAt: "2026-04-03 09:00:00"
  },
  {
    id: "log-2",
    type: "operation",
    actor: "operator.max",
    role: "operator",
    message: "发布了 Portable Volleyball Net 教程视频。",
    metadata: null,
    createdAt: "2026-04-03 09:35:00"
  }
];

module.exports = {
  seedAdminUsers,
  seedSiteSettings,
  seedHomeContent,
  seedCategories,
  seedVideoCategories,
  seedProducts,
  seedVideos,
  seedBlogs,
  seedSeo,
  seedInquiries,
  seedSubscribers,
  seedLogs
};
