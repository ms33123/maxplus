import {
  seedBlogCategories,
  seedBlogs,
  seedBlogPage,
  seedBrandStory,
  seedCategories,
  seedHomeContent,
  seedSubscribePopup,
  seedInquiries,
  seedLogs,
  seedProducts,
  seedSeo,
  seedSiteSettings,
  seedSubscribers,
  seedVideoCategories,
  seedVideos
} from "../data/seed";
import type {
  AdminBootstrapPayload,
  AdminRole,
  AdminSession,
  BlogRecord,
  BlogPageState,
  BlogCategoryRecord,
  BrandStoryState,
  CategoryRecord,
  CategoryFilterConfigRecord,
  HomeContentState,
  InquiryRecord,
  ProductRecord,
  SeoSettingsState,
  SiteSettingsState,
  SubscribePopupState,
  SubscriberRecord,
  VideoCategoryRecord,
  VideoRecord
} from "../types/admin";
import { readStorage, writeStorage } from "../utils/storage";

interface MockLoginPayload {
  token: string;
  session: AdminSession;
}

interface MockDatabase {
  siteSettings: SiteSettingsState;
  homeContent: HomeContentState;
  subscribePopup: SubscribePopupState;
  blogPage: BlogPageState;
  brandStory: BrandStoryState;
  seoSettings: SeoSettingsState;
  categories: CategoryRecord[];
  videoCategories: VideoCategoryRecord[];
  blogCategories: BlogCategoryRecord[];
  products: ProductRecord[];
  videos: VideoRecord[];
  blogs: BlogRecord[];
  inquiries: InquiryRecord[];
  subscribers: SubscriberRecord[];
  logs: AdminBootstrapPayload["logs"];
}

const MOCK_DB_KEY = "maxplus-sysadmin-mock-db";
const MOCK_TOKEN_PREFIX = "mock-token:";

const MOCK_USERS: Array<{
  username: string;
  password: string;
  role: AdminRole;
}> = [
  { username: "admin", password: "maxplus123", role: "super-admin" },
  { username: "operator.max", password: "maxplus123", role: "operator" },
  { username: "support.max", password: "maxplus123", role: "support" }
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createDefaultMockDatabase(): MockDatabase {
  return {
    siteSettings: clone(seedSiteSettings),
    homeContent: clone(seedHomeContent),
    subscribePopup: clone(seedSubscribePopup),
    blogPage: clone(seedBlogPage),
    brandStory: clone(seedBrandStory),
    seoSettings: clone(seedSeo),
    categories: clone(seedCategories),
    videoCategories: clone(seedVideoCategories),
    blogCategories: clone(seedBlogCategories),
    products: clone(seedProducts),
    videos: clone(seedVideos),
    blogs: clone(seedBlogs),
    inquiries: clone(seedInquiries),
    subscribers: clone(seedSubscribers),
    logs: clone(seedLogs)
  };
}

const LEGACY_VIDEO_CATEGORY_MAP: Record<string, string> = {
  "cat-1": "vcat-7",
  "cat-2": "vcat-3",
  "cat-4": "vcat-5"
};

function mergeById<T extends { id: string }>(base: T[], additions: T[]) {
  const map = new Map(base.map((item) => [item.id, item]));

  for (const item of additions) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return Array.from(map.values());
}

function inferCategoryVisual(slug?: string) {
  const map: Record<string, string> = {
    "team-sports": "catalog-hero__visual--team",
    "training-gear": "catalog-hero__visual--training",
    "outdoor-play": "catalog-hero__visual--outdoor",
    recovery: "catalog-hero__visual--recovery"
  };

  return map[slug || ""] || "catalog-hero__visual--training";
}

function createDefaultCategoryFilterConfig(): CategoryFilterConfigRecord {
  return {
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
  };
}

function normalizeCategoryRecord<T extends CategoryRecord>(record: T): T {
  const summary = record.summary?.trim() || `${record.name} category content.`;
  const bannerTitle = record.bannerTitle?.trim() || record.name;
  const bannerText = record.bannerText?.trim() || summary;
  const defaults = createDefaultCategoryFilterConfig();
  const rawFilterConfig = record.filterConfig ?? defaults;
  const filterConfig = {
    sportLabel: rawFilterConfig.sportLabel?.trim() || defaults.sportLabel,
    audienceLabel: rawFilterConfig.audienceLabel?.trim() || defaults.audienceLabel,
    useCaseLabel: rawFilterConfig.useCaseLabel?.trim() || defaults.useCaseLabel,
    stockLabel: rawFilterConfig.stockLabel?.trim() || defaults.stockLabel,
    sortLabel: rawFilterConfig.sortLabel?.trim() || defaults.sortLabel,
    allLabel: rawFilterConfig.allLabel?.trim() || defaults.allLabel,
    sortDefaultLabel: rawFilterConfig.sortDefaultLabel?.trim() || defaults.sortDefaultLabel,
    sortLatestLabel: rawFilterConfig.sortLatestLabel?.trim() || defaults.sortLatestLabel,
    sortPriceAscLabel: rawFilterConfig.sortPriceAscLabel?.trim() || defaults.sortPriceAscLabel,
    sortPriceDescLabel: rawFilterConfig.sortPriceDescLabel?.trim() || defaults.sortPriceDescLabel,
    sortBestSellingLabel:
      rawFilterConfig.sortBestSellingLabel?.trim() || defaults.sortBestSellingLabel
  };

  return {
    ...record,
    eyebrow: record.eyebrow?.trim() || "Category",
    summary,
    bannerTitle,
    bannerText,
    filterConfig,
    visualClass: record.visualClass?.trim() || inferCategoryVisual(record.slug),
    highlights: (record.highlights ?? []).map((item) => item.trim()).filter(Boolean),
    stats: (record.stats ?? []).filter((item) => item?.value?.trim() && item?.label?.trim())
  };
}

function readMockDatabase(): MockDatabase {
  const defaults = createDefaultMockDatabase();
  const stored = readStorage<MockDatabase>(MOCK_DB_KEY, defaults);
  const videoCategories = mergeById(stored.videoCategories ?? [], defaults.videoCategories).map((item) =>
    normalizeCategoryRecord(item)
  );
  const blogCategories = mergeById(stored.blogCategories ?? [], defaults.blogCategories);
  const categories = (stored.categories ?? defaults.categories).map((item) => normalizeCategoryRecord(item));
  const videoCategoryIds = new Set(videoCategories.map((item) => item.id));
  const blogCategoryNameMap = new Map(blogCategories.map((item) => [item.id, item.name]));
  const videos = (stored.videos ?? defaults.videos).map((item) => ({
    ...item,
    categoryId:
      videoCategoryIds.has(item.categoryId)
        ? item.categoryId
        : LEGACY_VIDEO_CATEGORY_MAP[item.categoryId] || defaults.videoCategories[0]?.id || ""
  }));

  return {
    siteSettings: stored.siteSettings ?? defaults.siteSettings,
    homeContent: stored.homeContent ?? defaults.homeContent,
    subscribePopup: stored.subscribePopup ?? defaults.subscribePopup,
    blogPage: stored.blogPage ?? defaults.blogPage,
    brandStory: stored.brandStory ?? defaults.brandStory,
    seoSettings: stored.seoSettings ?? defaults.seoSettings,
    categories,
    videoCategories,
    blogCategories,
    products: stored.products ?? defaults.products,
    videos,
    blogs: (stored.blogs ?? defaults.blogs).map((item) => ({
      ...item,
      category:
        blogCategoryNameMap.get(item.categoryId) ||
        item.category ||
        defaults.blogCategories[0]?.name ||
        ""
    })),
    inquiries: stored.inquiries ?? defaults.inquiries,
    subscribers: stored.subscribers ?? defaults.subscribers,
    logs: stored.logs ?? defaults.logs
  };
}

function writeMockDatabase(database: MockDatabase) {
  writeStorage(MOCK_DB_KEY, database);
}

function buildDashboard(database: MockDatabase): AdminBootstrapPayload["dashboard"] {
  return {
    publishedProducts: database.products.filter((item) => item.status === "published").length,
    publishedVideos: database.videos.filter((item) => item.status === "published").length,
    publishedBlogs: database.blogs.filter((item) => item.status === "published").length,
    pendingInquiries: database.inquiries.filter((item) => item.status !== "closed").length
  };
}

function upsertById<T extends { id: string }>(source: T[], record: T) {
  const index = source.findIndex((item) => item.id === record.id);

  if (index >= 0) {
    source.splice(index, 1, record);
    return;
  }

  source.unshift(record);
}

function removeById<T extends { id: string }>(source: T[], id: string) {
  const index = source.findIndex((item) => item.id === id);

  if (index >= 0) {
    source.splice(index, 1);
  }
}

function ensureId(prefix: string, id?: string) {
  return id && id.trim() ? id : `${prefix}-${Date.now()}`;
}

export function isMockToken(token?: string | null) {
  return Boolean(token && token.startsWith(MOCK_TOKEN_PREFIX));
}

export function loginWithMock(username: string, password: string, role: AdminRole): MockLoginPayload {
  const matchedUser = MOCK_USERS.find((item) => item.username === username);

  if (!matchedUser) {
    throw new Error("账号不存在或已被禁用。");
  }

  if (matchedUser.password !== password) {
    throw new Error("用户名或密码错误。");
  }

  if (role && role !== matchedUser.role) {
    throw new Error("所选角色与账号权限不匹配。");
  }

  const session: AdminSession = {
    username: matchedUser.username,
    role: matchedUser.role,
    loggedInAt: new Date().toISOString()
  };
  const database = readMockDatabase();

  database.logs.unshift({
    id: `log-${Date.now()}`,
    type: "login",
    actor: matchedUser.username,
    role: matchedUser.role,
    message: "后端不可用，已通过本地演示模式进入系统。",
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false })
  });
  writeMockDatabase(database);

  return {
    token: `${MOCK_TOKEN_PREFIX}${matchedUser.username}:${Date.now()}`,
    session
  };
}

export function getMockBootstrap(session: AdminSession | null): AdminBootstrapPayload {
  if (!session) {
    throw new Error("未登录或登录已过期。");
  }

  const database = readMockDatabase();

  return {
    session: clone(session),
    dashboard: buildDashboard(database),
    siteSettings: clone(database.siteSettings),
    homeContent: clone(database.homeContent),
    subscribePopup: clone(database.subscribePopup),
    blogPage: clone(database.blogPage),
    brandStory: clone(database.brandStory),
    seoSettings: clone(database.seoSettings),
    categories: clone(database.categories),
    videoCategories: clone(database.videoCategories),
    blogCategories: clone(database.blogCategories),
    products: clone(database.products),
    videos: clone(database.videos),
    blogs: clone(database.blogs),
    inquiries: clone(database.inquiries),
    subscribers: clone(database.subscribers),
    logs: clone(database.logs)
  };
}

export function saveMockProduct(record: ProductRecord): ProductRecord {
  const database = readMockDatabase();
  const saved = {
    ...record,
    id: ensureId("prd", record.id)
  };

  upsertById(database.products, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function saveMockVideo(record: VideoRecord): VideoRecord {
  const database = readMockDatabase();
  const saved = {
    ...record,
    id: ensureId("vid", record.id)
  };

  upsertById(database.videos, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function saveMockBlog(record: BlogRecord): BlogRecord {
  const database = readMockDatabase();
  const categoryLabel =
    database.blogCategories.find((item) => item.id === record.categoryId)?.name || record.category || "";
  const saved = {
    ...record,
    category: categoryLabel,
    id: ensureId("blog", record.id)
  };

  upsertById(database.blogs, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function saveMockBlogCategory(record: BlogCategoryRecord): BlogCategoryRecord {
  const database = readMockDatabase();
  const saved = {
    ...record,
    id: ensureId("bcat", record.id)
  };

  upsertById(database.blogCategories, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function saveMockCategory(record: CategoryRecord): CategoryRecord {
  const database = readMockDatabase();
  const saved = normalizeCategoryRecord({
    ...record,
    id: ensureId("cat", record.id)
  });

  upsertById(database.categories, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function saveMockVideoCategory(record: VideoCategoryRecord): VideoCategoryRecord {
  const database = readMockDatabase();
  const saved = normalizeCategoryRecord({
    ...record,
    id: ensureId("vcat", record.id)
  });

  upsertById(database.videoCategories, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function removeMockProduct(id: string) {
  const database = readMockDatabase();
  removeById(database.products, id);
  writeMockDatabase(database);
}

export function removeMockVideo(id: string) {
  const database = readMockDatabase();
  removeById(database.videos, id);
  writeMockDatabase(database);
}

export function removeMockBlog(id: string) {
  const database = readMockDatabase();
  removeById(database.blogs, id);
  writeMockDatabase(database);
}

export function removeMockBlogCategory(id: string) {
  const database = readMockDatabase();
  removeById(database.blogCategories, id);
  writeMockDatabase(database);
}

export function removeMockCategory(id: string) {
  const database = readMockDatabase();
  removeById(database.categories, id);
  writeMockDatabase(database);
}

export function removeMockVideoCategory(id: string) {
  const database = readMockDatabase();
  removeById(database.videoCategories, id);
  writeMockDatabase(database);
}

export function saveMockSiteSettings(value: SiteSettingsState): SiteSettingsState {
  const database = readMockDatabase();
  database.siteSettings = clone(value);
  writeMockDatabase(database);
  return clone(database.siteSettings);
}

export function saveMockHomeContent(value: HomeContentState): HomeContentState {
  const database = readMockDatabase();
  database.homeContent = clone(value);
  writeMockDatabase(database);
  return clone(database.homeContent);
}

export function saveMockSubscribePopup(value: SubscribePopupState): SubscribePopupState {
  const database = readMockDatabase();
  database.subscribePopup = clone(value);
  writeMockDatabase(database);
  return clone(database.subscribePopup);
}

export function saveMockBlogPage(value: BlogPageState): BlogPageState {
  const database = readMockDatabase();
  database.blogPage = clone(value);
  writeMockDatabase(database);
  return clone(database.blogPage);
}

export function saveMockSeoSettings(value: SeoSettingsState): SeoSettingsState {
  const database = readMockDatabase();
  database.seoSettings = clone(value);
  writeMockDatabase(database);
  return clone(database.seoSettings);
}

export function saveMockBrandStory(value: BrandStoryState): BrandStoryState {
  const database = readMockDatabase();
  database.brandStory = clone(value);
  writeMockDatabase(database);
  return clone(database.brandStory);
}

export function updateMockInquiry(record: InquiryRecord): InquiryRecord {
  const database = readMockDatabase();
  const current = database.inquiries.find((item) => item.id === record.id);
  const updated = {
    ...(current ?? record),
    id: record.id,
    status: record.status,
    assignee: record.assignee
  };

  upsertById(database.inquiries, updated);
  writeMockDatabase(database);
  return clone(updated);
}

export function saveMockSubscribers(items: SubscriberRecord[]) {
  const database = readMockDatabase();
  database.subscribers = clone(items);
  writeMockDatabase(database);
}
