export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const pageTitleMap: Record<string, string> = {
  dashboard: "仪表盘",
  "site-settings": "站点设置",
  "mailer-settings": "邮件配置",
  products: "商品管理",
  categories: "商品分类",
  videos: "视频管理",
  "video-categories": "视频分类",
  "brand-story-admin": "品牌故事",
  "blog-posts": "文章列表",
  "blog-categories": "文章分类",
  "blog-page-settings": "博客页面",
  "blog-editor": "博客编辑",
  "blog-editor-new": "新建文章",
  "home-hero": "首页轮播",
  "home-products": "首页产品",
  "home-videos": "首页视频",
  "home-categories": "首页分类",
  "home-reviews": "首页评价配置",
  "home-contact": "首页联系",
  "home-subscribe": "订阅弹窗",
  "review-content": "评论内容管理",
  "module-switches": "首页模块开关",
  inquiries: "询盘管理",
  subscribers: "订阅管理",
  seo: "SEO",
  logs: "系统日志"
};

export function resolvePageTitle(routeName?: string | null, fallback = "后台管理系统") {
  if (!routeName) {
    return fallback;
  }

  return pageTitleMap[routeName] ?? fallback;
}

export const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  dashboard: [{ label: "仪表盘" }],
  "site-settings": [
    { label: "系统配置", path: "/settings/site" },
    { label: "站点设置" }
  ],
  "mailer-settings": [
    { label: "系统配置", path: "/settings/site" },
    { label: "邮件配置" }
  ],
  products: [
    { label: "商品中心", path: "/catalog/products" },
    { label: "商品管理" }
  ],
  categories: [
    { label: "商品中心", path: "/catalog/products" },
    { label: "商品分类" }
  ],
  videos: [
    { label: "视频管理", path: "/media/videos" },
    { label: "视频管理" }
  ],
  "video-categories": [
    { label: "视频管理", path: "/media/videos" },
    { label: "视频分类" }
  ],
  "brand-story-admin": [
    { label: "内容管理", path: "/content/brand-story" },
    { label: "品牌故事" }
  ],
  "blog-posts": [
    { label: "博客管理", path: "/content/blog/posts" },
    { label: "文章列表" }
  ],
  "blog-categories": [
    { label: "博客管理", path: "/content/blog/posts" },
    { label: "文章分类" }
  ],
  "blog-page-settings": [
    { label: "博客管理", path: "/content/blog/posts" },
    { label: "博客页面" }
  ],
  "blog-editor": [
    { label: "博客管理", path: "/content/blog/posts" },
    { label: "文章编辑" }
  ],
  "blog-editor-new": [
    { label: "博客管理", path: "/content/blog/posts" },
    { label: "新建文章" }
  ],
  "home-hero": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页轮播" }
  ],
  "home-products": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页产品" }
  ],
  "home-videos": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页视频" }
  ],
  "home-categories": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页分类" }
  ],
  "home-reviews": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页评价配置" }
  ],
  "home-contact": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页联系" }
  ],
  "home-subscribe": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "订阅弹窗" }
  ],
  "review-content": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "评论内容管理" }
  ],
  "module-switches": [
    { label: "首页运营", path: "/content/home/hero" },
    { label: "首页模块开关" }
  ],
  inquiries: [
    { label: "线索管理", path: "/crm/inquiries" },
    { label: "询盘管理" }
  ],
  subscribers: [
    { label: "线索管理", path: "/crm/inquiries" },
    { label: "订阅管理" }
  ],
  seo: [
    { label: "系统配置", path: "/settings/site" },
    { label: "SEO" }
  ],
  logs: [
    { label: "系统配置", path: "/settings/site" },
    { label: "系统日志" }
  ]
};
