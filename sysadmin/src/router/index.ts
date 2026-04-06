import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "../stores/session";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: {
      guestOnly: true
    }
  },
  {
    path: "/",
    component: () => import("../layout/AdminLayout.vue"),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "",
        redirect: "/dashboard"
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("../views/dashboard/DashboardView.vue")
      },
      {
        path: "settings/site",
        name: "site-settings",
        component: () => import("../views/settings/SiteSettingsView.vue")
      },
      {
        path: "settings/mailer",
        name: "mailer-settings",
        component: () => import("../views/settings/MailerSettingsView.vue")
      },
      {
        path: "catalog/products",
        name: "products",
        component: () => import("../views/catalog/ProductsView.vue")
      },
      {
        path: "catalog/categories",
        name: "categories",
        component: () => import("../views/catalog/CategoriesView.vue")
      },
      {
        path: "media",
        redirect: "/media/videos"
      },
      {
        path: "media/videos",
        name: "videos",
        component: () => import("../views/media/VideosView.vue")
      },
      {
        path: "media/categories",
        name: "video-categories",
        component: () => import("../views/media/VideoCategoriesView.vue")
      },
      {
        path: "content/blog",
        redirect: "/content/blog/posts"
      },
      {
        path: "content/blog/posts",
        name: "blog-posts",
        component: () => import("../views/content/BlogPostsView.vue")
      },
      {
        path: "content/blog/categories",
        name: "blog-categories",
        component: () => import("../views/content/BlogCategoriesView.vue")
      },
      {
        path: "content/blog/settings",
        name: "blog-page-settings",
        component: () => import("../views/content/BlogPageSettingsView.vue")
      },
      {
        path: "content/blog/editor/new",
        name: "blog-editor-new",
        component: () => import("../views/content/BlogEditorView.vue")
      },
      {
        path: "content/blog/editor/:id",
        name: "blog-editor",
        component: () => import("../views/content/BlogEditorView.vue")
      },
      {
        path: "content/brand-story",
        name: "brand-story-admin",
        component: () => import("../views/content/BrandStoryView.vue")
      },
      {
        path: "content/home",
        redirect: "/content/home/hero"
      },
      {
        path: "content/home/hero",
        name: "home-hero",
        component: () => import("../views/content/HomeHeroView.vue")
      },
      {
        path: "content/home/products",
        name: "home-products",
        component: () => import("../views/content/HomeProductsView.vue")
      },
      {
        path: "content/home/videos",
        name: "home-videos",
        component: () => import("../views/content/HomeVideosView.vue")
      },
      {
        path: "content/home/categories",
        name: "home-categories",
        component: () => import("../views/content/HomeCategoriesView.vue")
      },
      {
        path: "content/home/reviews",
        name: "home-reviews",
        component: () => import("../views/content/HomeReviewsView.vue")
      },
      {
        path: "content/home/contact",
        name: "home-contact",
        component: () => import("../views/content/HomeContactView.vue")
      },
      {
        path: "content/home/subscribe",
        name: "home-subscribe",
        component: () => import("../views/content/SubscribePopupView.vue")
      },
      {
        path: "content/reviews/manage",
        name: "review-content",
        component: () => import("../views/content/ReviewContentView.vue")
      },
      {
        path: "content/modules",
        name: "module-switches",
        component: () => import("../views/content/ModuleSwitchesView.vue")
      },
      {
        path: "crm/inquiries",
        name: "inquiries",
        component: () => import("../views/crm/InquiriesView.vue")
      },
      {
        path: "crm/subscribers",
        name: "subscribers",
        component: () => import("../views/crm/SubscribersView.vue")
      },
      {
        path: "seo",
        name: "seo",
        component: () => import("../views/seo/SeoView.vue")
      },
      {
        path: "system/logs",
        name: "logs",
        component: () => import("../views/system/LogsView.vue")
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard"
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const sessionStore = useSessionStore();

  if (to.meta.requiresAuth && !sessionStore.isAuthenticated) {
    return "/login";
  }

  if (to.meta.guestOnly && sessionStore.isAuthenticated) {
    return "/dashboard";
  }

  return true;
});
