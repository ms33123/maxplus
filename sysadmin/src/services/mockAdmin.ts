import {
  seedBlogs,
  seedCategories,
  seedHomeContent,
  seedInquiries,
  seedLogs,
  seedProducts,
  seedSeo,
  seedSiteSettings,
  seedSubscribers,
  seedVideos
} from "../data/seed";
import type {
  AdminBootstrapPayload,
  AdminRole,
  AdminSession,
  BlogRecord,
  CategoryRecord,
  HomeContentState,
  InquiryRecord,
  ProductRecord,
  SeoSettingsState,
  SiteSettingsState,
  SubscriberRecord,
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
  seoSettings: SeoSettingsState;
  categories: CategoryRecord[];
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
    seoSettings: clone(seedSeo),
    categories: clone(seedCategories),
    products: clone(seedProducts),
    videos: clone(seedVideos),
    blogs: clone(seedBlogs),
    inquiries: clone(seedInquiries),
    subscribers: clone(seedSubscribers),
    logs: clone(seedLogs)
  };
}

function readMockDatabase(): MockDatabase {
  return readStorage<MockDatabase>(MOCK_DB_KEY, createDefaultMockDatabase());
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
    seoSettings: clone(database.seoSettings),
    categories: clone(database.categories),
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
  const saved = {
    ...record,
    id: ensureId("blog", record.id)
  };

  upsertById(database.blogs, saved);
  writeMockDatabase(database);
  return clone(saved);
}

export function saveMockCategory(record: CategoryRecord): CategoryRecord {
  const database = readMockDatabase();
  const saved = {
    ...record,
    id: ensureId("cat", record.id)
  };

  upsertById(database.categories, saved);
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

export function removeMockCategory(id: string) {
  const database = readMockDatabase();
  removeById(database.categories, id);
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

export function saveMockSeoSettings(value: SeoSettingsState): SeoSettingsState {
  const database = readMockDatabase();
  database.seoSettings = clone(value);
  writeMockDatabase(database);
  return clone(database.seoSettings);
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
