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
  theme: {
    preset: "default",
    effectsEnabled: true
  },
  mailer: {
    enabled: false,
    host: "",
    port: 587,
    secure: false,
    username: "",
    passwordCipher: "",
    fromEmail: "hello@maxplus-sport.com",
    fromName: "MaxPlus Sporting Goods",
    replyTo: "support@maxplus-sport.com",
    subjectTemplate: "Thanks for subscribing to {{brandName}}",
    htmlTemplate:
      "<p>Hi {{subscriberEmail}},</p><p>Thanks for subscribing to {{brandName}}.</p><p>We have recorded your request and will use your details only for the updates you opted into.</p>{{fieldSummaryHtml}}<p>If you did not request this subscription, you can ignore this message.</p>",
    textTemplate:
      "Hi {{subscriberEmail}},\n\nThanks for subscribing to {{brandName}}.\n\nWe have recorded your request and will use your details only for the updates you opted into.\n\n{{fieldSummaryText}}\n\nIf you did not request this subscription, you can ignore this message."
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

const seedSubscribePopup = {
  enabled: true,
  stylePreset: "classic-gift",
  toggleLabel: "Subscribe For Perks",
  eyebrow: "Member Benefits",
  title: "Subscribe with your email and order number.",
  text: "Use the popup to collect after-sales updates, member offers, and restock notices.",
  benefitsTitle: "After subscribing you can receive:",
  benefits: [
    "Early access to new product drops and restock alerts.",
    "Order-based after-sales updates and tutorial reminders.",
    "Member-only coupons and selected seasonal offers."
  ],
  submitLabel: "Subscribe",
  successMessage: "Subscription received. Please check your email inbox.",
  sourceLabel: "Website Subscribe Widget",
  formFields: [
    {
      id: "subscribe-field-email",
      key: "email",
      type: "email",
      label: "Email",
      placeholder: "Email address",
      enabled: true,
      required: true,
      options: []
    },
    {
      id: "subscribe-field-order-number",
      key: "order_number",
      type: "text",
      label: "Order Number",
      placeholder: "Order number",
      enabled: true,
      required: true,
      options: []
    }
  ]
};

const seedHomeContent = {
  heroSlides: [
    {
      id: "hero-1",
      eyebrow: "Athletic Lifestyle / Team Sports",
      title: "Sporting Goods That Look Ready To Move",
      subtitle: "Homepage hero for product and wholesale traffic.",
      targetUrl: "/products",
      primaryLabel: "Explore Products",
      secondaryLabel: "Brand Story",
      secondaryTargetUrl: "/brand-story",
      imageUrl: "/images/hero-training.svg",
      enabled: true
    },
    {
      id: "hero-2",
      eyebrow: "Training / Recovery / Performance",
      title: "Modern Layout With Product Depth",
      subtitle: "Second hero slide for category and SEO expansion.",
      targetUrl: "/videos",
      primaryLabel: "View Categories",
      secondaryLabel: "Search Catalog",
      secondaryTargetUrl: "/search",
      imageUrl: "/images/hero-performance.svg",
      enabled: true
    },
    {
      id: "hero-3",
      eyebrow: "Backyard / Team / Recreation",
      title: "Built For Clubs, Camps, Retail, And Family Use",
      subtitle: "Third hero slide for broader brand positioning.",
      targetUrl: "/buy",
      primaryLabel: "Go To Buy",
      secondaryLabel: "Watch Tutorials",
      secondaryTargetUrl: "/videos",
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
  productSection: {
    eyebrow: "Featured Products",
    title: "Featured Products",
    text: "",
    detailsLabel: "View Details",
    moreLabel: "More Products"
  },
  featuredProductSlugs: [
    "portable-volleyball-net-kit",
    "agility-cone-ladder-set",
    "resistance-band-pack",
    "match-ball-pack"
  ],
  videoSection: {
    eyebrow: "Video Guides",
    title: "Tutorial Videos",
    text: "",
    featuredCtaLabel: "Watch Tutorial",
    moreLabel: "More Videos"
  },
  featuredVideoSlugs: ["portable-volleyball-net-setup", "cone-drill-station"],
  categorySection: {
    eyebrow: "Category Layout",
    title: "A homepage that can scale across multiple sports categories.",
    text: "",
    moreLabel: "More Categories"
  },
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
  contactSection: {
    eyebrow: "Feedback",
    title: "Feedback",
    text: "",
    successMessage: "Thanks. We will get back to you soon.",
    formFields: [
      {
        id: "contact-field-name",
        key: "name",
        type: "text",
        label: "Name",
        placeholder: "Your name",
        enabled: true,
        required: true,
        options: []
      },
      {
        id: "contact-field-email",
        key: "email",
        type: "email",
        label: "Email",
        placeholder: "name@email.com",
        enabled: true,
        required: true,
        options: []
      },
      {
        id: "contact-field-phone",
        key: "phone",
        type: "tel",
        label: "Phone",
        placeholder: "Your phone number",
        enabled: false,
        required: false,
        options: []
      },
      {
        id: "contact-field-company",
        key: "company",
        type: "text",
        label: "Company",
        placeholder: "Your company name",
        enabled: false,
        required: false,
        options: []
      },
      {
        id: "contact-field-interest",
        key: "interest",
        type: "select",
        label: "Main Interest",
        placeholder: "Choose one",
        enabled: true,
        required: true,
        options: [
          { value: "team-sports", label: "Team sports" },
          { value: "training", label: "Training gear" },
          { value: "outdoor-play", label: "Outdoor play" },
          { value: "mixed", label: "Mixed product range" }
        ]
      },
      {
        id: "contact-field-message",
        key: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us what style or product direction you want to keep.",
        enabled: true,
        required: true,
        options: []
      }
    ],
    fields: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "name@email.com",
      phoneLabel: "Phone",
      phonePlaceholder: "Your phone number",
      companyLabel: "Company",
      companyPlaceholder: "Your company name",
      interestLabel: "Main Interest",
      chooseOne: "Choose one",
      messageLabel: "Message",
      messagePlaceholder: "Tell us what style or product direction you want to keep.",
      submitLabel: "Send Feedback"
    },
    fieldConfig: {
      name: { enabled: true, required: true },
      email: { enabled: true, required: true },
      phone: { enabled: false, required: false },
      company: { enabled: false, required: false },
      interest: { enabled: true, required: true },
      message: { enabled: true, required: true }
    },
    interestOptions: [
      { value: "team-sports", label: "Team sports" },
      { value: "training", label: "Training gear" },
      { value: "outdoor-play", label: "Outdoor play" },
      { value: "mixed", label: "Mixed product range" }
    ]
  },
  sectionToggles: [
    { key: "hero", label: "首屏轮播", enabled: true },
    { key: "videos", label: "视频模块", enabled: true },
    { key: "products", label: "精选商品", enabled: true },
    { key: "categories", label: "分类模块", enabled: true },
    { key: "reviews", label: "评价模块", enabled: true },
    { key: "contact", label: "联系模块", enabled: true }
  ]
};

const seedBrandStory = {
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
      id: "brand-highlight-1",
      tag: "Capability",
      title: "Multi-category catalog",
      text: "Built to sell training, team-sport, outdoor, and recovery lines under one brand."
    },
    {
      id: "brand-highlight-2",
      tag: "Workflow",
      title: "Retail-ready presentation",
      text: "Structured for buyers who need quick product clarity and credible brand signals."
    },
    {
      id: "brand-highlight-3",
      tag: "Support",
      title: "Wholesale inquiry path",
      text: "The site is designed to capture product intent and route it into a lead workflow."
    },
    {
      id: "brand-highlight-4",
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

const seedBlogPage = {
  metaTitle: "Blog | MaxPlus Sporting Goods",
  metaDescription:
    "Browse MaxPlus blog articles for buying guides, training notes, merchandising ideas, and catalog planning updates.",
  heroEyebrow: "Brand Blog",
  heroTitle: "Blog",
  heroText: "Buying guides, training notes, and product planning ideas for a stronger sporting goods catalog.",
  allCategoriesLabel: "All Articles",
  searchPlaceholder: "Search articles by title, excerpt, or keyword",
  sortLatestLabel: "Newest First",
  sortOldestLabel: "Oldest First",
  resultsLabel: "articles",
  categoriesLabel: "categories",
  updatedLabel: "Latest update",
  readMoreLabel: "Read Article",
  emptyTitle: "No blog content matches the current filters.",
  emptyText: "Adjust the category or search keyword, or publish more articles from the admin panel.",
  previousLabel: "Previous",
  nextLabel: "Next",
  perPage: 6
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
    detailTitle: "Built For Clubs, Schools, And Community Programs",
    detailText:
      "The Team Sports category is structured around repeat-use products that support PE classes, school teams, club practices, event setups, and recreational programs. The range focuses on portable systems, durable accessories, and practical wholesale order planning.",
    detailPoints: [
      "Portable systems designed for repeat setup and breakdown",
      "Core assortment for clubs, schools, camps, and community leagues",
      "Balanced for wholesale replenishment, seasonal promotions, and retail programs"
    ],
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
    detailTitle: "Daily-Use Training Equipment With Clear Merchandising Logic",
    detailText:
      "Training Gear is positioned as a practical category for coaches, clubs, schools, and retailers that need products with clear session value. The assortment emphasizes agility, conditioning, and repetition-based tools that are easy to bundle and easy to understand.",
    detailPoints: [
      "Coach-friendly products for agility, footwork, reaction, and conditioning drills",
      "Compact bundles that are easy to store, ship, and cross-sell together",
      "Suitable for both institutional buying and retail add-on programs"
    ],
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
    detailTitle: "Portable Leisure Products For Backyard And Seasonal Demand",
    detailText:
      "Outdoor Play brings together lightweight, fast-setup products for family recreation, park use, beach activity, and event rentals. The category is especially useful for spring-summer sales windows and assortment planning that prioritizes portability and ease of use.",
    detailPoints: [
      "Fast-assembly products for beach, park, picnic, and backyard use",
      "Strong fit for spring-summer campaigns and gift-oriented merchandising",
      "Simple pack-out designed to reduce support friction and return risk"
    ],
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
    detailTitle: "Recovery And Mobility Products With Strong Bundle Value",
    detailText:
      "Recovery is designed as a flexible support category for sports, wellness, studio, and home-use programs. The assortment helps extend the catalog beyond pure gameplay or training by adding recovery, warmup, and mobility products with compact packaging and broad use cases.",
    detailPoints: [
      "Compact recovery tools that work as add-on purchases and bundle items",
      "Useful across retail, studio, rehab-inspired, and home fitness contexts",
      "Easy category bridge between training, recovery, and general wellness demand"
    ],
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
    name: "力量",
    slug: "strength",
    parent: "顶级分类",
    sortOrder: 1,
    enabled: true,
    seoTitle: "力量训练视频分类"
  },
  {
    id: "vcat-1",
    name: "俯卧撑",
    slug: "push-up",
    parent: "力量",
    sortOrder: 2,
    enabled: true,
    seoTitle: "俯卧撑视频分类"
  },
  {
    id: "vcat-2",
    name: "卧推",
    slug: "bench-press",
    parent: "力量",
    sortOrder: 3,
    enabled: true,
    seoTitle: "卧推视频分类"
  },
  {
    id: "vcat-parent-2",
    name: "敏捷训练",
    slug: "agility-training",
    parent: "顶级分类",
    sortOrder: 4,
    enabled: true,
    seoTitle: "敏捷训练视频分类"
  },
  {
    id: "vcat-3",
    name: "锥桶步伐",
    slug: "cone-footwork",
    parent: "敏捷训练",
    sortOrder: 5,
    enabled: true,
    seoTitle: "锥桶步伐视频分类"
  },
  {
    id: "vcat-4",
    name: "梯子步法",
    slug: "ladder-steps",
    parent: "敏捷训练",
    sortOrder: 6,
    enabled: true,
    seoTitle: "梯子步法视频分类"
  },
  {
    id: "vcat-parent-3",
    name: "恢复训练",
    slug: "recovery-routines",
    parent: "顶级分类",
    sortOrder: 7,
    enabled: true,
    seoTitle: "恢复训练视频分类"
  },
  {
    id: "vcat-5",
    name: "泡沫轴放松",
    slug: "roller-reset",
    parent: "恢复训练",
    sortOrder: 8,
    enabled: true,
    seoTitle: "泡沫轴放松视频分类"
  },
  {
    id: "vcat-6",
    name: "拉伸",
    slug: "stretching",
    parent: "恢复训练",
    sortOrder: 9,
    enabled: true,
    seoTitle: "拉伸视频分类"
  },
  {
    id: "vcat-parent-4",
    name: "器材安装",
    slug: "equipment-setup",
    parent: "顶级分类",
    sortOrder: 10,
    enabled: true,
    seoTitle: "器材安装视频分类"
  },
  {
    id: "vcat-7",
    name: "球网安装",
    slug: "net-setup",
    parent: "器材安装",
    sortOrder: 11,
    enabled: true,
    seoTitle: "球网安装视频分类"
  },
  {
    id: "vcat-8",
    name: "场地布置",
    slug: "court-layout",
    parent: "器材安装",
    sortOrder: 12,
    enabled: true,
    seoTitle: "场地布置视频分类"
  }
];

const seedBlogCategories = [
  {
    id: "bcat-1",
    name: "Training",
    slug: "training",
    sortOrder: 1,
    enabled: true,
    seoTitle: "Training Articles",
    description: "Training guides, drills, and setup suggestions."
  },
  {
    id: "bcat-2",
    name: "Buying Guide",
    slug: "buying-guide",
    sortOrder: 2,
    enabled: true,
    seoTitle: "Buying Guide Articles",
    description: "Retail, wholesale, and sourcing decision support."
  },
  {
    id: "bcat-3",
    name: "Brand Updates",
    slug: "brand-updates",
    sortOrder: 3,
    enabled: true,
    seoTitle: "Brand Update Articles",
    description: "Campaign, product line, and company update posts."
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
    categoryId: "vcat-7",
    topic: "Setup",
    topicSlug: "setup",
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
    categoryId: "vcat-3",
    topic: "Drills",
    topicSlug: "drills",
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
    categoryId: "vcat-5",
    topic: "Routine",
    topicSlug: "routine",
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
    categoryId: "bcat-1",
    category: "Training",
    author: "Operations Team",
    status: "published",
    publishDate: "2026-04-01",
    excerpt: "Portable nets, cones, and drill gear for home use.",
    body: [
      "Backyard training products work best when setup time stays short and product purpose is obvious.",
        "Portable systems, fast-fold goals, and simple drill kits usually outperform complex bundles in first-time purchases."
      ],
      bodyHtml:
        "<p>Backyard training products work best when setup time stays short and product purpose is obvious.</p><p>Portable systems, fast-fold goals, and simple drill kits usually outperform complex bundles in first-time purchases.</p>",
      meta: "Operations Team / 2026-04-01",
      coverImage: "/images/hero-training.svg"
  },
  {
    id: "blog-2",
    title: "What Retailers Look For In Entry-Level Sports Gear",
    slug: "what-retailers-look-for-in-entry-level-sports-gear",
    categoryId: "bcat-2",
    category: "Buying Guide",
    author: "Brand Team",
    status: "draft",
    publishDate: "2026-04-02",
    excerpt: "Packaging, range depth, and product clarity for first-buy confidence.",
      body: [
        "For first orders, merchants often favor compact master cartons, simple demo visuals, and products that sit well beside team-sport, training, and outdoor assortments."
      ],
      bodyHtml:
        "<p>For first orders, merchants often favor compact master cartons, simple demo visuals, and products that sit well beside team-sport, training, and outdoor assortments.</p>",
      meta: "Brand Team / 2026-04-02",
      coverImage: "/images/hero-recreation.svg"
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
    fields: [
      { key: "email", label: "Email", value: "jane@example.com", type: "email" },
      { key: "order_number", label: "Order Number", value: "MP-10021", type: "text" }
    ],
    emailStatus: "sent",
    emailSentAt: "2026-04-02 15:11:30",
    emailError: "",
    createdAt: "2026-04-02 15:11:00"
  },
  {
    id: "sub-2",
    email: "coach@academy.org",
    source: "去购买页面",
    orderNumber: "MP-10045",
    fields: [
      { key: "email", label: "Email", value: "coach@academy.org", type: "email" },
      { key: "order_number", label: "Order Number", value: "MP-10045", type: "text" }
    ],
    emailStatus: "failed",
    emailSentAt: "",
    emailError: "SMTP transport not configured.",
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
  seedSubscribePopup,
  seedHomeContent,
  seedBrandStory,
  seedBlogPage,
  seedCategories,
  seedVideoCategories,
  seedBlogCategories,
  seedProducts,
  seedVideos,
  seedBlogs,
  seedSeo,
  seedInquiries,
  seedSubscribers,
  seedLogs
};
