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
        path: "media/videos",
        name: "videos",
        component: () => import("../views/media/VideosView.vue")
      },
      {
        path: "content/blog",
        name: "blog",
        component: () => import("../views/content/BlogView.vue")
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
        path: "content/home/reviews",
        name: "home-reviews",
        component: () => import("../views/content/HomeReviewsView.vue")
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
