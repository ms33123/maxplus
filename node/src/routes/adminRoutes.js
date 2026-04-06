const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { ok } = require("../utils/response");
const { resolveRequestPayload } = require("../utils/request");
const {
  getSiteSettings,
  saveSiteSettings,
  getSubscribePopup,
  saveSubscribePopup,
  getHomeContent,
  saveHomeContent,
  getBlogPage,
  saveBlogPage,
  getBrandStory,
  saveBrandStory,
  getSeoSettings,
  saveSeoSettings
} = require("../services/settingsService");
const {
  getCatalogBundle,
  saveCategory,
  saveVideoCategory,
  saveBlogCategory,
  saveProduct,
  saveVideo,
  saveBlog,
  deleteCategory,
  deleteVideoCategory,
  deleteBlogCategory,
  deleteProduct,
  deleteVideo,
  deleteBlog
} = require("../services/catalogService");
const {
  listInquiries,
  updateInquiry,
  listSubscribers
} = require("../services/crmService");
const { listLogs, addLog, getDashboardSummary } = require("../services/systemService");

const router = express.Router();

router.use(requireAuth);

async function writeOperationLog(req, message, metadata = null) {
  await addLog({
    type: "operation",
    actor: req.user.username,
    role: req.user.role,
    message,
    metadata
  });
}

router.post(
  "/bootstrap",
  asyncHandler(async (req, res) => {
    const [
      dashboard,
      siteSettings,
      homeContent,
      subscribePopup,
      brandStory,
      blogPage,
      seoSettings,
      catalog,
      inquiries,
      subscribers,
      logs
    ] = await Promise.all([
      getDashboardSummary(),
      getSiteSettings(),
      getHomeContent(),
      getSubscribePopup(),
      getBrandStory(),
      getBlogPage(),
      getSeoSettings(),
      getCatalogBundle(),
      listInquiries(),
      listSubscribers(),
      listLogs()
    ]);

    return ok(res, {
      dashboard,
      siteSettings,
      homeContent,
      subscribePopup,
      brandStory,
      seoSettings,
      ...catalog,
      inquiries,
      subscribers,
      logs,
      session: req.user
    });
  })
);

router.post(
  "/dashboard",
  asyncHandler(async (req, res) => {
    return ok(res, await getDashboardSummary());
  })
);

router.post(
  "/site/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getSiteSettings());
  })
);

router.post(
  "/site/save",
  asyncHandler(async (req, res) => {
    const data = await saveSiteSettings(resolveRequestPayload(req));
    await writeOperationLog(req, "保存了站点基础设置。");
    return ok(res, data, "站点设置已保存。");
  })
);

router.post(
  "/subscribe-popup/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getSubscribePopup());
  })
);

router.post(
  "/subscribe-popup/save",
  asyncHandler(async (req, res) => {
    const data = await saveSubscribePopup(resolveRequestPayload(req));
    await writeOperationLog(req, "保存了订阅弹窗配置。");
    return ok(res, data, "订阅弹窗配置已保存。");
  })
);

router.post(
  "/home/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getHomeContent());
  })
);

router.post(
  "/home/save",
  asyncHandler(async (req, res) => {
    const data = await saveHomeContent(resolveRequestPayload(req));
    await writeOperationLog(req, "保存了首页内容配置。");
    return ok(res, data, "首页内容已保存。");
  })
);

router.post(
  "/blog-page/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getBlogPage());
  })
);

router.post(
  "/blog-page/save",
  asyncHandler(async (req, res) => {
    const data = await saveBlogPage(resolveRequestPayload(req));
    await writeOperationLog(req, "保存了博客列表页配置。");
    return ok(res, data, "博客页面配置已保存。");
  })
);

router.post(
  "/brand-story/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getBrandStory());
  })
);

router.post(
  "/brand-story/save",
  asyncHandler(async (req, res) => {
    const data = await saveBrandStory(resolveRequestPayload(req));
    await writeOperationLog(req, "保存了品牌故事页面内容。");
    return ok(res, data, "品牌故事内容已保存。");
  })
);

router.post(
  "/seo/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getSeoSettings());
  })
);

router.post(
  "/seo/save",
  asyncHandler(async (req, res) => {
    const data = await saveSeoSettings(resolveRequestPayload(req));
    await writeOperationLog(req, "保存了 SEO 设置。");
    return ok(res, data, "SEO 设置已保存。");
  })
);

router.post(
  "/catalog/get",
  asyncHandler(async (req, res) => {
    return ok(res, await getCatalogBundle());
  })
);

router.post(
  "/categories/save",
  asyncHandler(async (req, res) => {
    const data = await saveCategory(resolveRequestPayload(req));
    await writeOperationLog(req, `保存分类：${data.name}`);
    return ok(res, data, "分类已保存。");
  })
);

router.post(
  "/categories/delete",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    await deleteCategory(payload.id);
    await writeOperationLog(req, `删除分类：${payload.id}`);
    return ok(res, null, "分类已删除。");
  })
);

router.post(
  "/video-categories/save",
  asyncHandler(async (req, res) => {
    const data = await saveVideoCategory(resolveRequestPayload(req));
    await writeOperationLog(req, `保存视频分类：${data.name}`);
    return ok(res, data, "视频分类已保存。");
  })
);

router.post(
  "/video-categories/delete",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    await deleteVideoCategory(payload.id);
    await writeOperationLog(req, `删除视频分类：${payload.id}`);
    return ok(res, null, "视频分类已删除。");
  })
);

router.post(
  "/blog-categories/save",
  asyncHandler(async (req, res) => {
    const data = await saveBlogCategory(resolveRequestPayload(req));
    await writeOperationLog(req, `保存文章分类：${data.name}`);
    return ok(res, data, "文章分类已保存。");
  })
);

router.post(
  "/blog-categories/delete",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    await deleteBlogCategory(payload.id);
    await writeOperationLog(req, `删除文章分类：${payload.id}`);
    return ok(res, null, "文章分类已删除。");
  })
);

router.post(
  "/products/save",
  asyncHandler(async (req, res) => {
    const data = await saveProduct(resolveRequestPayload(req));
    await writeOperationLog(req, `保存商品：${data.title}`);
    return ok(res, data, "商品已保存。");
  })
);

router.post(
  "/products/delete",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    await deleteProduct(payload.id);
    await writeOperationLog(req, `删除商品：${payload.id}`);
    return ok(res, null, "商品已删除。");
  })
);

router.post(
  "/videos/save",
  asyncHandler(async (req, res) => {
    const data = await saveVideo(resolveRequestPayload(req));
    await writeOperationLog(req, `保存视频：${data.title}`);
    return ok(res, data, "视频已保存。");
  })
);

router.post(
  "/videos/delete",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    await deleteVideo(payload.id);
    await writeOperationLog(req, `删除视频：${payload.id}`);
    return ok(res, null, "视频已删除。");
  })
);

router.post(
  "/blogs/save",
  asyncHandler(async (req, res) => {
    const data = await saveBlog(resolveRequestPayload(req));
    await writeOperationLog(req, `保存博客：${data.title}`);
    return ok(res, data, "博客已保存。");
  })
);

router.post(
  "/blogs/delete",
  asyncHandler(async (req, res) => {
    const payload = resolveRequestPayload(req);
    await deleteBlog(payload.id);
    await writeOperationLog(req, `删除博客：${payload.id}`);
    return ok(res, null, "博客已删除。");
  })
);

router.post(
  "/inquiries/list",
  asyncHandler(async (req, res) => {
    return ok(res, await listInquiries());
  })
);

router.post(
  "/inquiries/update",
  asyncHandler(async (req, res) => {
    const data = await updateInquiry(resolveRequestPayload(req));
    await writeOperationLog(req, `更新询盘状态：${data?.id || "unknown"}`);
    return ok(res, data, "询盘状态已更新。");
  })
);

router.post(
  "/subscribers/list",
  asyncHandler(async (req, res) => {
    return ok(res, await listSubscribers());
  })
);

router.post(
  "/logs/list",
  asyncHandler(async (req, res) => {
    return ok(res, await listLogs());
  })
);

module.exports = router;
