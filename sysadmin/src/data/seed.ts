import type {
  BlogRecord,
  CategoryRecord,
  HomeContentState,
  InquiryRecord,
  LogRecord,
  ProductRecord,
  SeoSettingsState,
  SiteSettingsState,
  SubscriberRecord,
  VideoRecord
} from "../types/admin";

export const seedSiteSettings: SiteSettingsState = {
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
  }
};

export const seedHomeContent: HomeContentState = {
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
  featuredProductSlugs: ["portable-volleyball-net-kit", "agility-cone-ladder-set", "resistance-band-pack"],
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

export const seedCategories: CategoryRecord[] = [
  {
    id: "cat-1",
    name: "Team Sports",
    slug: "team-sports",
    parent: "顶级分类",
    sortOrder: 1,
    enabled: true,
    seoTitle: "Team Sports Equipment"
  },
  {
    id: "cat-2",
    name: "Training Gear",
    slug: "training-gear",
    parent: "顶级分类",
    sortOrder: 2,
    enabled: true,
    seoTitle: "Training Gear And Conditioning"
  },
  {
    id: "cat-3",
    name: "Outdoor Play",
    slug: "outdoor-play",
    parent: "顶级分类",
    sortOrder: 3,
    enabled: true,
    seoTitle: "Outdoor Play Products"
  },
  {
    id: "cat-4",
    name: "Recovery",
    slug: "recovery",
    parent: "顶级分类",
    sortOrder: 4,
    enabled: true,
    seoTitle: "Recovery And Mobility Gear"
  }
];

export const seedProducts: ProductRecord[] = [
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
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  },
  {
    id: "prd-3",
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
    buyButtonLabel: "Go To Buy",
    buyButtonUrl: "/buy"
  }
];

export const seedVideos: VideoRecord[] = [
  {
    id: "vid-1",
    title: "How To Set Up The Portable Volleyball Net",
    slug: "portable-volleyball-net-setup",
    categoryId: "cat-1",
    topic: "Setup",
    duration: "03:42",
    status: "published",
    cover: "/images/video-net-cover.png",
    videoUrl: "https://videos.maxplus.local/portable-volleyball-net-setup",
    summary: "Setup walkthrough for clubs, camps, and family buyers."
  },
  {
    id: "vid-2",
    title: "Cone Drill Setup In 5 Minutes",
    slug: "cone-drill-station",
    categoryId: "cat-2",
    topic: "Drills",
    duration: "04:05",
    status: "published",
    cover: "/images/video-cone-cover.png",
    videoUrl: "https://videos.maxplus.local/cone-drill-station",
    summary: "Fast drill layout for PE and quick training sessions."
  },
  {
    id: "vid-3",
    title: "Recovery Roller Reset Routine",
    slug: "roller-reset-routine",
    categoryId: "cat-4",
    topic: "Routine",
    duration: "03:14",
    status: "draft",
    cover: "/images/video-roller-cover.png",
    videoUrl: "https://videos.maxplus.local/roller-reset-routine",
    summary: "Compact mobility routine built around the roller kit."
  }
];

export const seedBlogs: BlogRecord[] = [
  {
    id: "blog-1",
    title: "How To Build A Better Backyard Practice Setup",
    slug: "better-backyard-practice-setup",
    category: "Training",
    author: "Operations Team",
    status: "published",
    publishDate: "2026-04-01",
    excerpt: "Portable nets, cones, and drill gear for home use."
  },
  {
    id: "blog-2",
    title: "What Retailers Look For In Entry-Level Sports Gear",
    slug: "what-retailers-look-for-in-entry-level-sports-gear",
    category: "Buying Guide",
    author: "Brand Team",
    status: "draft",
    publishDate: "2026-04-02",
    excerpt: "Packaging, range depth, and product clarity for first-buy confidence."
  }
];

export const seedInquiries: InquiryRecord[] = [
  {
    id: "inq-1",
    source: "wholesale",
    customer: "Ryan Cooper",
    email: "ryan@fieldhouse.com",
    company: "Fieldhouse Supply",
    status: "new",
    assignee: "Unassigned",
    message: "Need quote for 80 portable net kits and 120 training sets.",
    createdAt: "2026-04-03 09:15"
  },
  {
    id: "inq-2",
    source: "product",
    customer: "Maria Wells",
    email: "maria@coastclub.com",
    company: "Coast Club",
    status: "processing",
    assignee: "Derek",
    message: "Interested in custom logo print for match ball packs.",
    createdAt: "2026-04-03 10:42"
  }
];

export const seedSubscribers: SubscriberRecord[] = [
  {
    id: "sub-1",
    email: "jane@example.com",
    source: "首页订阅弹窗",
    orderNumber: "MP-10021",
    createdAt: "2026-04-02 15:11"
  },
  {
    id: "sub-2",
    email: "coach@academy.org",
    source: "去购买页面",
    orderNumber: "MP-10045",
    createdAt: "2026-04-03 08:56"
  }
];

export const seedSeo: SeoSettingsState = {
  globalTitle: "MaxPlus Sporting Goods",
  globalDescription: "Multi-page sporting goods site with products, videos, blog, and wholesale flow.",
  ogImage: "/images/maxplus-og.png",
  sitemapEnabled: true,
  robotsIndex: true,
  productTemplate: "{product} | MaxPlus Sporting Goods",
  categoryTemplate: "{category} | MaxPlus Categories",
  blogTemplate: "{post} | MaxPlus Blog"
};

export const seedLogs: LogRecord[] = [
  {
    id: "log-1",
    type: "login",
    actor: "admin",
    role: "super-admin",
    message: "从后台登录页进入系统。",
    createdAt: "2026-04-03 09:00"
  },
  {
    id: "log-2",
    type: "operation",
    actor: "operator.max",
    role: "operator",
    message: "发布了 Portable Volleyball Net 教程视频。",
    createdAt: "2026-04-03 09:35"
  }
];
