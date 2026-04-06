import type {
  BlogPost,
  CatalogCategory,
  CatalogProduct,
  ContactChannel,
  PolicyDocument,
  SearchSuggestion,
  VideoCategory,
  TutorialVideo
} from "../types/catalog";
import type { BrandStoryContent, HighlightItem } from "../types/content";

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "team-sports",
    title: "Team Sports",
    eyebrow: "Category",
    summary: "Portable game-day gear for clubs, schools, camps, and community leagues.",
    bannerTitle: "Team Sports",
    bannerText: "Portable systems, durable match gear, and easy-pack field essentials.",
    filterConfig: {
      sportLabel: "Sport Type",
      audienceLabel: "Audience",
      useCaseLabel: "Use",
      stockLabel: "Stock",
      sortLabel: "Sort",
      allLabel: "All",
      sortDefaultLabel: "Default",
      sortLatestLabel: "Latest",
      sortPriceAscLabel: "Price Low To High",
      sortPriceDescLabel: "Price High To Low",
      sortBestSellingLabel: "Best Selling"
    },
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
    slug: "training-gear",
    title: "Training Gear",
    eyebrow: "Category",
    summary: "Footwork, conditioning, and drill equipment built for daily repetition.",
    bannerTitle: "Training Gear",
    bannerText: "Agility kits, rebound tools, and coach-friendly sets for repeat sessions.",
    filterConfig: {
      sportLabel: "Sport Type",
      audienceLabel: "Audience",
      useCaseLabel: "Use",
      stockLabel: "Stock",
      sortLabel: "Sort",
      allLabel: "All",
      sortDefaultLabel: "Default",
      sortLatestLabel: "Latest",
      sortPriceAscLabel: "Price Low To High",
      sortPriceDescLabel: "Price High To Low",
      sortBestSellingLabel: "Best Selling"
    },
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
    slug: "outdoor-play",
    title: "Outdoor Play",
    eyebrow: "Category",
    summary: "Backyard, beach, and park products designed for fast setup and casual use.",
    bannerTitle: "Outdoor Play",
    bannerText: "Portable systems for active families, rental operators, and spring-summer retail.",
    filterConfig: {
      sportLabel: "Sport Type",
      audienceLabel: "Audience",
      useCaseLabel: "Use",
      stockLabel: "Stock",
      sortLabel: "Sort",
      allLabel: "All",
      sortDefaultLabel: "Default",
      sortLatestLabel: "Latest",
      sortPriceAscLabel: "Price Low To High",
      sortPriceDescLabel: "Price High To Low",
      sortBestSellingLabel: "Best Selling"
    },
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
    slug: "recovery",
    title: "Recovery",
    eyebrow: "Category",
    summary: "Recovery tools and resistance products for mobility, warmup, and after-training care.",
    bannerTitle: "Recovery",
    bannerText: "Compact recovery tools that are easy to bundle with strength and team-sport lines.",
    filterConfig: {
      sportLabel: "Sport Type",
      audienceLabel: "Audience",
      useCaseLabel: "Use",
      stockLabel: "Stock",
      sortLabel: "Sort",
      allLabel: "All",
      sortDefaultLabel: "Default",
      sortLatestLabel: "Latest",
      sortPriceAscLabel: "Price Low To High",
      sortPriceDescLabel: "Price High To Low",
      sortBestSellingLabel: "Best Selling"
    },
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

export const catalogProducts: CatalogProduct[] = [
  {
    slug: "portable-volleyball-net-kit",
    title: "Portable Volleyball Net Kit",
    categorySlug: "team-sports",
    categoryLabel: "Team Sports",
    tag: "Best Seller",
    summary: "Outdoor-ready poles, adjustable net tension, and a carry bag for fast deployment.",
    description:
      "A launch-friendly court kit for clubs, camps, and active-family retail. The system packs down quickly, sets up with minimal tools, and reads as a premium category anchor for spring and summer buying.",
    price: "$129",
    referencePrice: "$149 MSRP",
    stockStatus: "In Stock",
    sku: "MP-VNET-2401",
    orderMinimum: "24 sets",
    leadTime: "12-15 business days",
    sportType: "Volleyball",
    audience: "Club / Family",
    useCase: "Outdoor Setup",
    visualClass: "product-card__visual--net",
    galleryClasses: [
      "catalog-gallery__item--net-main",
      "catalog-gallery__item--net-detail",
      "catalog-gallery__item--net-pack"
    ],
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
    relatedSlugs: ["match-ball-pack", "pop-up-soccer-goal-duo", "agility-cone-ladder-set"],
    featured: true
  },
  {
    slug: "agility-cone-ladder-set",
    title: "Agility Cone & Ladder Set",
    categorySlug: "training-gear",
    categoryLabel: "Training Gear",
    tag: "Training",
    summary: "Fast-footwork kit for camps, clubs, schools, and home training sessions.",
    description:
      "A core training bundle built around fast session setup and compact storage. The mix of cones and ladder sections makes it an easy entry product for retail programs that want practical, coach-approved gear.",
    price: "$49",
    referencePrice: "$59 MSRP",
    stockStatus: "In Stock",
    sku: "MP-AGIL-1108",
    orderMinimum: "48 sets",
    leadTime: "10-12 business days",
    sportType: "Multi-Sport",
    audience: "Coach / School",
    useCase: "Speed Training",
    visualClass: "product-card__visual--cones",
    galleryClasses: [
      "catalog-gallery__item--cone-main",
      "catalog-gallery__item--cone-session",
      "catalog-gallery__item--cone-pack"
    ],
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
    relatedSlugs: ["speed-hurdle-set", "rebound-trainer-pro", "portable-volleyball-net-kit"],
    featured: true
  },
  {
    slug: "resistance-band-pack",
    title: "Resistance Band Pack",
    categorySlug: "recovery",
    categoryLabel: "Recovery",
    tag: "Recovery",
    summary: "Compact strength and mobility pack with multiple resistance levels.",
    description:
      "A compact band assortment aimed at recovery corners, home fitness shelves, and bundle promotions. The color-coded set supports warmup, mobility, and light strength routines without needing large storage space.",
    price: "$34",
    referencePrice: "$42 MSRP",
    stockStatus: "In Stock",
    sku: "MP-BAND-3304",
    orderMinimum: "60 packs",
    leadTime: "8-10 business days",
    sportType: "Recovery",
    audience: "Retail / Studio",
    useCase: "Mobility",
    visualClass: "product-card__visual--bands",
    galleryClasses: [
      "catalog-gallery__item--band-main",
      "catalog-gallery__item--band-routine",
      "catalog-gallery__item--band-pack"
    ],
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
    relatedSlugs: ["recovery-roller-kit", "agility-cone-ladder-set", "match-ball-pack"],
    featured: true
  },
  {
    slug: "match-ball-pack",
    title: "Match Ball Pack",
    categorySlug: "team-sports",
    categoryLabel: "Team Sports",
    tag: "Team Play",
    summary: "Durable composite game balls for school, club, and backyard use.",
    description:
      "A multi-ball pack created for practical replenishment orders. It works as a club or school staple and also fits seasonal retail promotions that need a higher perceived value than single-ball listings.",
    price: "$79",
    referencePrice: "$95 MSRP",
    stockStatus: "Limited Stock",
    sku: "MP-BALL-5602",
    orderMinimum: "18 packs",
    leadTime: "7-10 business days",
    sportType: "Soccer / Volleyball",
    audience: "Club / School",
    useCase: "Match & Practice",
    visualClass: "product-card__visual--balls",
    galleryClasses: [
      "catalog-gallery__item--ball-main",
      "catalog-gallery__item--ball-club",
      "catalog-gallery__item--ball-pack"
    ],
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
    relatedSlugs: ["portable-volleyball-net-kit", "pop-up-soccer-goal-duo", "resistance-band-pack"],
    featured: true
  },
  {
    slug: "rebound-trainer-pro",
    title: "Rebound Trainer Pro",
    categorySlug: "training-gear",
    categoryLabel: "Training Gear",
    tag: "Coach Pick",
    summary: "Compact rebound frame for passing drills, first touch work, and reaction training.",
    description:
      "A coach-oriented trainer that gives the training range more depth and a higher perceived performance tier. It fits clubs, academies, and stores that want to anchor a more serious training assortment.",
    price: "$159",
    referencePrice: "$189 MSRP",
    stockStatus: "Made To Order",
    sku: "MP-REBD-8820",
    orderMinimum: "12 units",
    leadTime: "18-22 business days",
    sportType: "Soccer",
    audience: "Coach / Club",
    useCase: "Ball Return Training",
    visualClass: "product-card__visual--goal",
    galleryClasses: [
      "catalog-gallery__item--goal-main",
      "catalog-gallery__item--goal-angle",
      "catalog-gallery__item--goal-pack"
    ],
    highlights: [
      "Adjustable rebound angle for multiple drill patterns",
      "Strong profile for club practice environments",
      "Premium anchor product for serious training assortments"
    ],
    specifications: [
      { label: "Frame", value: "Powder-coated tubular steel" },
      { label: "Net", value: "High-tension rebound mesh" },
      { label: "Adjustment", value: "Multi-angle lock positions" },
      { label: "Use", value: "Outdoor turf and hard court" }
    ],
    applications: ["First touch drills", "Keeper warmups", "Passing circuits"],
    shipping: "Ships KD with hardware separated by assembly stage to reduce setup errors.",
    support: "Setup guide, replacement hardware packs, and quote assistance available.",
    relatedSlugs: ["speed-hurdle-set", "agility-cone-ladder-set", "match-ball-pack"]
  },
  {
    slug: "pop-up-soccer-goal-duo",
    title: "Pop-Up Soccer Goal Duo",
    categorySlug: "outdoor-play",
    categoryLabel: "Outdoor Play",
    tag: "Outdoor",
    summary: "Foldable goal pair for backyard matches, skill games, and park sessions.",
    description:
      "A portable and easy-to-understand outdoor item that works well for recreational channels. It is strong on seasonality, simple to demonstrate in video, and attractive for family-oriented buying intent.",
    price: "$119",
    referencePrice: "$139 MSRP",
    stockStatus: "In Stock",
    sku: "MP-POPG-4405",
    orderMinimum: "20 pairs",
    leadTime: "10-14 business days",
    sportType: "Soccer",
    audience: "Family / Recreation",
    useCase: "Backyard Play",
    visualClass: "product-card__visual--goal",
    galleryClasses: [
      "catalog-gallery__item--outdoor-main",
      "catalog-gallery__item--outdoor-yard",
      "catalog-gallery__item--outdoor-pack"
    ],
    highlights: [
      "Quick fold frame for simple storage",
      "Good fit for spring and summer campaigns",
      "Useful for family recreation and entry club drills"
    ],
    specifications: [
      { label: "Set", value: "2 foldable goals" },
      { label: "Frame", value: "Flexible pop-up frame" },
      { label: "Included", value: "Ground stakes and carry bag" },
      { label: "Setup", value: "Less than 5 minutes" }
    ],
    applications: ["Backyard games", "Youth practice", "Park activations"],
    shipping: "Flat-packed in circular carry case cartons for efficient outbound handling.",
    support: "Seasonal merchandising suggestions and bundle planning available.",
    relatedSlugs: ["portable-volleyball-net-kit", "match-ball-pack", "agility-cone-ladder-set"]
  },
  {
    slug: "speed-hurdle-set",
    title: "Speed Hurdle Set",
    categorySlug: "training-gear",
    categoryLabel: "Training Gear",
    tag: "Conditioning",
    summary: "Lightweight speed hurdles built for footwork, acceleration, and repeat drills.",
    description:
      "An efficient conditioning accessory for coaches that need a lightweight but durable add-on. It pairs cleanly with cones and ladders, making it a useful second-step product inside the same training category.",
    price: "$69",
    referencePrice: "$79 MSRP",
    stockStatus: "Limited Stock",
    sku: "MP-HURD-2214",
    orderMinimum: "36 sets",
    leadTime: "9-12 business days",
    sportType: "Multi-Sport",
    audience: "Coach / School",
    useCase: "Conditioning",
    visualClass: "product-card__visual--hurdles",
    galleryClasses: [
      "catalog-gallery__item--hurdle-main",
      "catalog-gallery__item--hurdle-drill",
      "catalog-gallery__item--hurdle-pack"
    ],
    highlights: [
      "Nesting hurdles save shelf and storage space",
      "Useful for speed, rhythm, and coordination work",
      "Strong cross-sell fit with cone and ladder kits"
    ],
    specifications: [
      { label: "Count", value: "6 hurdles per set" },
      { label: "Height", value: "6 / 9 / 12 in mixed pack" },
      { label: "Material", value: "Flexible impact-resistant polymer" },
      { label: "Bag", value: "Strap carry bundle" }
    ],
    applications: ["Speed sessions", "School athletics", "Indoor circuits"],
    shipping: "Nesting form keeps carton volume controlled for better freight efficiency.",
    support: "Bundled quote options available with cones, ladders, and rebound gear.",
    relatedSlugs: ["agility-cone-ladder-set", "rebound-trainer-pro", "resistance-band-pack"]
  },
  {
    slug: "recovery-roller-kit",
    title: "Recovery Roller Kit",
    categorySlug: "recovery",
    categoryLabel: "Recovery",
    tag: "Mobility",
    summary: "Foam roller and massage ball set for warmup corners and recovery shelves.",
    description:
      "A simple but commercial recovery set that supports bundle promotions and everyday gym use. It works well for retailers that want practical wellness products with low training barriers for the end customer.",
    price: "$44",
    referencePrice: "$52 MSRP",
    stockStatus: "In Stock",
    sku: "MP-ROLL-6101",
    orderMinimum: "40 kits",
    leadTime: "8-10 business days",
    sportType: "Recovery",
    audience: "Gym / Retail",
    useCase: "Post-Workout",
    visualClass: "product-card__visual--roller",
    galleryClasses: [
      "catalog-gallery__item--roller-main",
      "catalog-gallery__item--roller-routine",
      "catalog-gallery__item--roller-pack"
    ],
    highlights: [
      "Pairs cleanly with resistance and recovery accessories",
      "Useful for gyms, studios, and checkout display bundles",
      "Straightforward product story for first-time buyers"
    ],
    specifications: [
      { label: "Included", value: "1 roller + 2 massage balls" },
      { label: "Surface", value: "Dual-texture EVA shell" },
      { label: "Use", value: "Warmup and post-training relief" },
      { label: "Packaging", value: "Retail band wrap" }
    ],
    applications: ["Recovery corners", "Gym retail", "At-home stretching"],
    shipping: "Compact packs with low breakage risk and easy mixed-carton packing.",
    support: "Merchandising support available for recovery bundles and starter kits.",
    relatedSlugs: ["resistance-band-pack", "speed-hurdle-set", "match-ball-pack"]
  }
];

export const videoCategories: VideoCategory[] = [
  { slug: "strength", title: "力量" },
  { slug: "push-up", title: "俯卧撑", parentTitle: "力量" },
  { slug: "bench-press", title: "卧推", parentTitle: "力量" },
  { slug: "agility-training", title: "敏捷训练" },
  { slug: "cone-footwork", title: "锥桶步伐", parentTitle: "敏捷训练" },
  { slug: "ladder-steps", title: "梯子步法", parentTitle: "敏捷训练" },
  { slug: "recovery-routines", title: "恢复训练" },
  { slug: "roller-reset", title: "泡沫轴放松", parentTitle: "恢复训练" },
  { slug: "stretching", title: "拉伸", parentTitle: "恢复训练" },
  { slug: "equipment-setup", title: "器材安装" },
  { slug: "net-setup", title: "球网安装", parentTitle: "器材安装" },
  { slug: "court-layout", title: "场地布置", parentTitle: "器材安装" }
];

export const tutorialVideos: TutorialVideo[] = [
  {
    slug: "portable-volleyball-net-setup",
    tag: "Featured Tutorial",
    title: "How To Set Up The Portable Volleyball Net",
    duration: "03:42",
    summary: "A clean step-by-step setup guide for clubs, camps, and family buyers.",
    visualClass: "video-feature__media--setup",
    coverImage: "/images/video-net-cover.png",
    videoUrl: "https://videos.maxplus.local/portable-volleyball-net-setup",
    categorySlug: "net-setup",
    topicSlug: "setup",
    topicLabel: "Setup",
    featured: true
  },
  {
    slug: "cone-drill-station",
    tag: "Training",
    title: "Cone Drill Setup In 5 Minutes",
    duration: "04:05",
    summary: "A repeatable drill layout for clinics, PE, and quick footwork sessions.",
    visualClass: "video-card__media--cones",
    coverImage: "/images/video-cone-cover.png",
    videoUrl: "https://videos.maxplus.local/cone-drill-station",
    categorySlug: "cone-footwork",
    topicSlug: "drills",
    topicLabel: "Drills"
  },
  {
    slug: "resistance-band-warmup",
    tag: "Basics",
    title: "Resistance Band Basics",
    duration: "02:18",
    summary: "Warmup and light activation patterns using the compact band pack.",
    visualClass: "video-card__media--bands",
    coverImage: "/images/video-roller-cover.png",
    videoUrl: "https://videos.maxplus.local/resistance-band-warmup",
    categorySlug: "stretching",
    topicSlug: "warmup",
    topicLabel: "Warmup"
  },
  {
    slug: "ball-care-storage",
    tag: "Care Guide",
    title: "Ball Care And Storage Tips",
    duration: "01:56",
    summary: "Simple routines that keep recreational and club-use balls ready longer.",
    visualClass: "video-card__media--balls",
    coverImage: "/images/video-net-cover.png",
    videoUrl: "https://videos.maxplus.local/ball-care-storage",
    categorySlug: "court-layout",
    topicSlug: "care",
    topicLabel: "Care"
  },
  {
    slug: "roller-reset-routine",
    tag: "Recovery",
    title: "Recovery Roller Reset Routine",
    duration: "03:14",
    summary: "A short mobility and reset sequence built around the roller kit.",
    visualClass: "video-card__media--bands",
    coverImage: "/images/video-roller-cover.png",
    videoUrl: "https://videos.maxplus.local/roller-reset-routine",
    categorySlug: "roller-reset",
    topicSlug: "routine",
    topicLabel: "Routine"
  },
  {
    slug: "pop-up-goal-fast-pack",
    tag: "Outdoor",
    title: "How To Fold The Pop-Up Goal Fast",
    duration: "02:46",
    summary: "A simple folding and pack-out walkthrough for yard and park use.",
    visualClass: "video-card__media--cones",
    coverImage: "/images/video-cone-cover.png",
    videoUrl: "https://videos.maxplus.local/pop-up-goal-fast-pack",
    categorySlug: "net-setup",
    topicSlug: "setup",
    topicLabel: "Setup"
  },
  {
    slug: "backyard-soccer-drill-layout",
    tag: "Practice",
    title: "Backyard Soccer Drill Layout",
    duration: "03:28",
    summary: "A compact outdoor practice layout built around foldable goals and markers.",
    visualClass: "video-card__media--balls",
    coverImage: "/images/video-net-cover.png",
    videoUrl: "https://videos.maxplus.local/backyard-soccer-drill-layout",
    categorySlug: "court-layout",
    topicSlug: "drills",
    topicLabel: "Drills"
  },
  {
    slug: "rebound-trainer-angle-guide",
    tag: "Coach Pick",
    title: "Rebound Trainer Angle Guide",
    duration: "03:06",
    summary: "A quick guide to using different rebound angles for first touch and return drills.",
    visualClass: "video-card__media--cones",
    coverImage: "/images/video-cone-cover.png",
    videoUrl: "https://videos.maxplus.local/rebound-trainer-angle-guide",
    categorySlug: "ladder-steps",
    topicSlug: "setup",
    topicLabel: "Setup"
  }
];

export const blogPosts: BlogPost[] = [
  {
    slug: "better-backyard-practice-setup",
    category: "Training",
    title: "How To Build A Better Backyard Practice Setup",
    excerpt: "A compact guide to choosing portable nets, cones, and training accessories for home use.",
    meta: "5 min read",
    author: "Operations Team",
    publishDate: "2026-04-01",
    coverImage: "/images/hero-training.svg",
    body: [
      "Backyard training products work best when setup time stays short and product purpose is obvious. That is why portable systems, fast-fold goals, and simple drill kits usually outperform complex bundles in first-time purchases.",
      "When building an assortment, start with one anchor item such as a portable net or foldable goal, then layer in smaller training accessories that increase basket value without making the decision heavy."
    ]
  },
  {
    slug: "what-retailers-look-for-in-entry-level-sports-gear",
    category: "Buying Guide",
    title: "What Retailers Look For In Entry-Level Sports Gear",
    excerpt: "The product cues, packaging signals, and presentation details that improve first-buy confidence.",
    meta: "4 min read",
    author: "Brand Team",
    publishDate: "2026-04-02",
    coverImage: "/images/hero-recreation.svg",
    body: [
      "Retail-friendly sports goods need clear use cases, credible materials, and packaging that signals low-friction setup. Products that are easy to explain in three sentences usually convert better in mixed-category environments.",
      "For first orders, merchants often favor compact master cartons, simple demo visuals, and products that sit well beside team-sport, training, and outdoor assortments."
    ]
  },
  {
    slug: "simple-maintenance-tips-for-nets-balls-and-bands",
    category: "Care",
    title: "Simple Maintenance Tips For Nets, Balls, And Bands",
    excerpt: "Basic storage and care routines that keep everyday sports equipment ready to use for longer.",
    meta: "3 min read",
    author: "Support Team",
    publishDate: "2026-03-29",
    coverImage: "/images/hero-performance.svg",
    body: [
      "Routine care content is useful because it lowers return risk and makes the brand feel more service-oriented. For sports gear, the strongest care messages are usually storage, drying, and simple wear checks.",
      "Adding short how-to videos for maintenance gives each product line more after-sales value without creating long support content."
    ]
  },
  {
    slug: "which-products-perform-best-during-spring-and-summer",
    category: "Seasonal",
    title: "Which Products Perform Best During Spring And Summer",
    excerpt: "A quick look at the most browseable outdoor and team-play items during peak activity months.",
    meta: "6 min read",
    author: "Planning Team",
    publishDate: "2026-03-25",
    coverImage: "/images/hero-recreation.svg",
    body: [
      "Outdoor play systems, portable nets, and casual match gear tend to read especially well during spring and summer campaigns. The visual signal of quick setup matters as much as the actual spec sheet.",
      "For seasonal planning, assortments that mix one hero item with two or three lower-priced accessories often create the cleanest browsing experience."
    ]
  },
  {
    slug: "how-coaches-bundle-training-gear-for-clinics",
    category: "Coaching",
    title: "How Coaches Bundle Training Gear For Clinics",
    excerpt: "A quick view of how cones, hurdles, and rebound tools build a scalable session kit.",
    meta: "5 min read",
    author: "Coaching Desk",
    publishDate: "2026-03-20",
    coverImage: "/images/hero-training.svg",
    body: [
      "Coaches usually build around repeatable categories: movement prep, footwork, directional speed, and ball return or finish work. That is why training ranges benefit from products that clearly sit inside a session sequence.",
      "When merchandise reflects that sequence, the catalog feels more coherent and commercial."
    ]
  },
  {
    slug: "why-recovery-products-improve-a-sports-catalog",
    category: "Recovery",
    title: "Why Recovery Products Improve A Sports Catalog",
    excerpt: "Recovery lines create higher basket flexibility and make the site feel more complete.",
    meta: "4 min read",
    author: "Merchandising Team",
    publishDate: "2026-03-16",
    coverImage: "/images/hero-performance.svg",
    body: [
      "Recovery tools often act as a category bridge. They connect training, team sport, and wellness shoppers while taking relatively little display space.",
      "For a young brand site, they also broaden the impression from single-purpose seller to fuller sports range."
    ]
  }
];

export const policyDocuments: PolicyDocument[] = [
  {
    type: "privacy",
    eyebrow: "Policy",
    title: "Privacy Policy",
    updatedAt: "Updated April 3, 2026",
    intro: "How MaxPlus collects and uses contact, inquiry, and subscription information.",
    sections: [
      {
        title: "Information We Collect",
        items: [
          "We collect contact details you submit through inquiry, wholesale, and subscription forms.",
          "We may store product interest, route source, and message content for lead follow-up.",
          "Cookie preferences may be stored locally in your browser to remember consent choices."
        ]
      },
      {
        title: "How We Use Information",
        items: [
          "To respond to wholesale requests, product questions, and subscription actions.",
          "To improve site structure, content performance, and campaign landing pages.",
          "To support future email marketing integrations after explicit opt-in."
        ]
      },
      {
        title: "Sharing And Storage",
        items: [
          "We do not sell personal data.",
          "Information may be processed by internal staff or approved service providers for customer support and site operations.",
          "Lead data is retained only as long as necessary for support, follow-up, or compliance purposes."
        ]
      }
    ]
  },
  {
    type: "shipping",
    eyebrow: "Policy",
    title: "Shipping Policy",
    updatedAt: "Updated April 3, 2026",
    intro: "Shipping timing, packaging notes, and delivery handling for standard and wholesale orders.",
    sections: [
      {
        title: "Processing Time",
        items: [
          "Lead times vary by product line, packaging method, and order volume.",
          "Made-to-order items may require extended production scheduling before dispatch.",
          "Quote confirmation will include estimated processing and shipping windows."
        ]
      },
      {
        title: "Shipping Scope",
        items: [
          "Shipping support is available for U.S.-focused retail and wholesale destinations.",
          "Freight, parcel, and mixed-carton options may be proposed based on item profile and order size.",
          "Exact carrier and warehouse details are confirmed during quotation or order review."
        ]
      },
      {
        title: "Delivery Notes",
        items: [
          "Please inspect cartons on arrival and report major transport damage promptly.",
          "Partial shipments may be used when product availability differs across items.",
          "Tracking details are shared when shipment mode supports them."
        ]
      }
    ]
  },
  {
    type: "refund",
    eyebrow: "Policy",
    title: "Refund Policy",
    updatedAt: "Updated April 3, 2026",
    intro: "Return review and refund handling for approved cases.",
    sections: [
      {
        title: "Return Eligibility",
        items: [
          "Return requests must be submitted within the approved review window after delivery.",
          "Products should be unused or accompanied by clear condition notes when a return is requested.",
          "Custom-branded or made-to-order items may be excluded unless quality issues are confirmed."
        ]
      },
      {
        title: "Review Process",
        items: [
          "Provide order information, product details, and issue description when contacting support.",
          "Photos or inspection details may be requested before approval is issued.",
          "Refund timing depends on inspection outcome and original payment arrangement."
        ]
      },
      {
        title: "Non-Refundable Situations",
        items: [
          "Normal wear from use is not considered a refundable condition.",
          "Requests without sufficient order or product trace information may be delayed or declined.",
          "Freight-related issues should be raised as soon as possible after receipt."
        ]
      }
    ]
  },
  {
    type: "terms",
    eyebrow: "Policy",
    title: "Terms Of Service",
    updatedAt: "Updated April 3, 2026",
    intro: "General terms governing use of the MaxPlus website and inquiry services.",
    sections: [
      {
        title: "Website Use",
        items: [
          "Site content is provided for brand presentation, product reference, and lead collection.",
          "Product availability, pricing references, and page content may change without prior notice.",
          "You agree not to misuse forms, route structure, or content for unlawful or abusive activity."
        ]
      },
      {
        title: "Product Information",
        items: [
          "Prices shown may be reference prices and do not constitute a final wholesale quotation.",
          "Images, diagrams, and visual cards may be representative and should be confirmed during the quote process.",
          "Specifications are subject to production, packaging, and regional compliance review."
        ]
      },
      {
        title: "Liability And Contact",
        items: [
          "We aim to keep the site accurate, but uninterrupted access and error-free content cannot be guaranteed.",
          "Commercial terms are finalized only after direct confirmation with MaxPlus.",
          "For questions about these terms, contact the business support address listed on the contact page."
        ]
      }
    ]
  }
];

export const defaultBrandStoryContent: BrandStoryContent = {
  metaTitle: "Brand Story | MaxPlus Sporting Goods",
  metaDescription:
    "Learn how MaxPlus positions its sporting goods catalog for retail, wholesale, and category growth.",
  heroEyebrow: "Brand Story",
  heroTitle: "About MaxPlus",
  heroText:
    "Built for U.S.-focused retail, club programs, and everyday play with a cleaner route from first impression to product confidence.",
  storyParagraphs: [
    "MaxPlus is positioned as a practical sporting goods brand for U.S.-focused retail, school, club, and active-family demand.",
    "The site direction emphasizes credibility, fast product reading, and a cleaner route from discovery to inquiry.",
    "Instead of feeling like a one-product landing page, the experience is designed to read as a structured commercial brand with category depth."
  ],
  stats: [
    { id: "brand-stat-1", value: "4", label: "core product families" },
    { id: "brand-stat-2", value: "8", label: "launch-ready catalog products" },
    { id: "brand-stat-3", value: "3", label: "lead capture paths" }
  ],
  highlights: [
    {
      tag: "Capability",
      title: "Multi-category catalog",
      text: "Built to sell training, team-sport, outdoor, and recovery lines under one brand."
    },
    {
      tag: "Workflow",
      title: "Retail-ready presentation",
      text: "Structured for buyers who need quick product clarity and credible brand signals."
    },
    {
      tag: "Support",
      title: "Wholesale inquiry path",
      text: "The site is designed to capture product intent and route it into a lead workflow."
    },
    {
      tag: "Growth",
      title: "Expandable content stack",
      text: "Ready to scale into SEO pages, campaigns, and future backend-driven management."
    }
  ],
  categoryEyebrow: "Product Families",
  categoryTitle: "Built to scale across multiple sports-driven buying needs.",
  categoryText:
    "Each category is maintained from the product classification system and can be presented here as part of the brand story."
};

export const aboutHighlights: HighlightItem[] = defaultBrandStoryContent.highlights;
export const aboutStory = defaultBrandStoryContent.storyParagraphs;
export const aboutStats = defaultBrandStoryContent.stats;

export const contactChannels: ContactChannel[] = [
  { label: "Business Email", value: "hello@maxplus-sport.com", href: "mailto:hello@maxplus-sport.com" },
  { label: "Sales Line", value: "+1 (800) 555-0199", href: "tel:+18005550199" },
  { label: "Warehouse Support", value: "Mon-Fri / 9:00-18:00 PST", href: "/contact" }
];

export const searchSuggestions: SearchSuggestion[] = [
  { label: "portable volleyball net", href: "/search?q=portable%20volleyball%20net" },
  { label: "agility cones", href: "/search?q=agility%20cones" },
  { label: "recovery bands", href: "/search?q=recovery%20bands" },
  { label: "backyard soccer goal", href: "/search?q=backyard%20soccer%20goal" }
];

export const footerQuickLinks: SearchSuggestion[] = [
  { label: "Brand Story", href: "/brand-story" },
  { label: "Search", href: "/search" },
  { label: "Contact", href: "/contact" },
  { label: "Wholesale Buy", href: "/buy" }
];

export const footerPolicyLinks: SearchSuggestion[] = [
  { label: "Privacy Policy", href: "/policy/privacy" },
  { label: "Shipping Policy", href: "/policy/shipping" },
  { label: "Refund Policy", href: "/policy/refund" },
  { label: "Terms", href: "/policy/terms" }
];

export function findCategoryBySlug(slug: string) {
  return catalogCategories.find((item) => item.slug === slug);
}

export function findProductBySlug(slug: string) {
  return catalogProducts.find((item) => item.slug === slug);
}

export function findPolicyByType(type: string) {
  return policyDocuments.find((item) => item.type === type);
}

export function getProductsByCategory(slug: string) {
  return catalogProducts.filter((item) => item.categorySlug === slug);
}

export function getRelatedProducts(product: CatalogProduct) {
  return product.relatedSlugs
    .map((slug) => findProductBySlug(slug))
    .filter((item): item is CatalogProduct => Boolean(item));
}
