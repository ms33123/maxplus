const { query } = require("../config/database");
const { safeParseJson, stringifyJson } = require("../utils/json");
const {
  sanitizeString,
  sanitizeText,
  normalizeBoolean,
  normalizeEnum,
  normalizeInteger,
  normalizeNumber,
  normalizeStringArray,
  slugify,
  ensureId
} = require("../utils/normalizers");
const { HttpError } = require("../utils/errors");

function inferCategoryVisual(slug) {
  const map = {
    "team-sports": "catalog-hero__visual--team",
    "training-gear": "catalog-hero__visual--training",
    "outdoor-play": "catalog-hero__visual--outdoor",
    recovery: "catalog-hero__visual--recovery"
  };

  return map[slug] || "catalog-hero__visual--team";
}

function inferProductVisual(slug) {
  const map = {
    "portable-volleyball-net-kit": "product-card__visual--net",
    "agility-cone-ladder-set": "product-card__visual--cones",
    "resistance-band-pack": "product-card__visual--bands",
    "match-ball-pack": "product-card__visual--balls"
  };

  return map[slug] || "product-card__visual--net";
}

function inferVideoVisual(slug) {
  const map = {
    "portable-volleyball-net-setup": "video-card__media--net",
    "cone-drill-station": "video-card__media--cones",
    "roller-reset-routine": "video-card__media--recovery"
  };

  return map[slug] || "video-card__media--net";
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    parent: row.parent_label,
    sortOrder: row.sort_order,
    enabled: Boolean(row.enabled),
    seoTitle: row.seo_title,
    summary: row.summary,
    bannerTitle: row.banner_title,
    bannerText: row.banner_text,
    visualClass: row.visual_class,
    highlights: safeParseJson(row.highlights_json, []),
    stats: safeParseJson(row.stats_json, [])
  };
}

function mapProduct(row) {
  const buyAction = safeParseJson(row.buy_action_json, {});

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    sku: row.sku,
    categoryId: row.category_id,
    price: Number(row.price),
    compareAtPrice: Number(row.compare_at_price),
    stock: row.stock,
    weight: row.weight,
    status: row.status,
    tags: safeParseJson(row.tags_json, []),
    heroImage: row.hero_image,
    gallery: safeParseJson(row.gallery_json, []),
    summary: row.summary,
    description: row.description,
    tagLabel: row.tag_label,
    orderMinimum: row.order_minimum,
    leadTime: row.lead_time,
    sportType: row.sport_type,
    audience: row.audience,
    useCase: row.use_case,
    visualClass: row.visual_class,
    highlights: safeParseJson(row.highlights_json, []),
    specifications: safeParseJson(row.specifications_json, []),
    applications: safeParseJson(row.applications_json, []),
    shipping: row.shipping,
    support: row.support,
    relatedSlugs: safeParseJson(row.related_slugs_json, []),
    featured: Boolean(row.featured),
    buyButtonLabel: buyAction.label || "Go To Buy",
    buyButtonUrl: buyAction.url || "/buy"
  };
}

function mapVideo(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.category_id,
    topic: row.topic,
    topicSlug: row.topic_slug,
    duration: row.duration,
    status: row.status,
    cover: row.cover,
    videoUrl: row.video_url,
    summary: row.summary,
    tagLabel: row.tag_label,
    visualClass: row.visual_class,
    featured: Boolean(row.featured)
  };
}

function mapBlog(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    author: row.author,
    status: row.status,
    publishDate: row.publish_date,
    excerpt: row.excerpt,
    body: safeParseJson(row.body_json, []),
    meta: row.meta
  };
}

async function getCategories(includeDisabled = true) {
  const rows = await query(
    `SELECT * FROM categories ${includeDisabled ? "" : "WHERE enabled = 1"} ORDER BY sort_order ASC, created_at ASC`
  );
  return rows.map(mapCategory);
}

async function getProducts(options = {}) {
  const conditions = [];
  const params = [];

  if (options.status) {
    conditions.push("status = ?");
    params.push(options.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await query(`SELECT * FROM products ${whereClause} ORDER BY created_at DESC`, params);
  return rows.map(mapProduct);
}

async function getVideos(options = {}) {
  const conditions = [];
  const params = [];

  if (options.status) {
    conditions.push("status = ?");
    params.push(options.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await query(`SELECT * FROM videos ${whereClause} ORDER BY created_at DESC`, params);
  return rows.map(mapVideo);
}

async function getBlogs(options = {}) {
  const conditions = [];
  const params = [];

  if (options.status) {
    conditions.push("status = ?");
    params.push(options.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await query(
    `SELECT * FROM blogs ${whereClause} ORDER BY publish_date DESC, created_at DESC`,
    params
  );
  return rows.map(mapBlog);
}

async function getCatalogBundle() {
  const [categories, products, videos, blogs] = await Promise.all([
    getCategories(true),
    getProducts(),
    getVideos(),
    getBlogs()
  ]);

  return {
    categories,
    products,
    videos,
    blogs
  };
}

function normalizeStatArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, 6)
    .map((item) => ({
      value: sanitizeString(item.value, { max: 40 }),
      label: sanitizeString(item.label, { max: 80 })
    }))
    .filter((item) => item.value && item.label);
}

function normalizeSpecificationArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, 10)
    .map((item) => ({
      label: sanitizeString(item.label, { max: 80 }),
      value: sanitizeString(item.value, { max: 160 })
    }))
    .filter((item) => item.label && item.value);
}

async function getCategoryById(id) {
  const rows = await query(`SELECT * FROM categories WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? mapCategory(rows[0]) : null;
}

async function getProductById(id) {
  const rows = await query(`SELECT * FROM products WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? mapProduct(rows[0]) : null;
}

async function getVideoById(id) {
  const rows = await query(`SELECT * FROM videos WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? mapVideo(rows[0]) : null;
}

async function getBlogById(id) {
  const rows = await query(`SELECT * FROM blogs WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? mapBlog(rows[0]) : null;
}

async function saveCategory(input) {
  const current = input.id ? await getCategoryById(input.id) : null;
  const slug = slugify(input.slug || input.name, current?.slug || "");

  const payload = {
    id: ensureId(input.id, "cat"),
    name: sanitizeString(input.name, { max: 120 }),
    slug,
    parent: sanitizeString(input.parent, {
      max: 120,
      defaultValue: current?.parent || "顶级分类"
    }),
    sortOrder: normalizeInteger(input.sortOrder, {
      min: 1,
      max: 9999,
      defaultValue: current?.sortOrder || 1
    }),
    enabled: normalizeBoolean(input.enabled, current?.enabled ?? true),
    seoTitle: sanitizeString(input.seoTitle, {
      max: 180,
      defaultValue: current?.seoTitle || input.name || ""
    }),
    summary: sanitizeText(input.summary, {
      max: 400,
      defaultValue: current?.summary || `${input.name} category content.`
    }),
    bannerTitle: sanitizeString(input.bannerTitle, {
      max: 180,
      defaultValue: current?.bannerTitle || input.name || ""
    }),
    bannerText: sanitizeText(input.bannerText, {
      max: 500,
      defaultValue: current?.bannerText || current?.summary || `${input.name} category introduction.`
    }),
    visualClass: sanitizeString(input.visualClass, {
      max: 120,
      defaultValue: current?.visualClass || inferCategoryVisual(slug)
    }),
    highlights: normalizeStringArray(
      input.highlights ?? current?.highlights ?? [input.name, "Catalog", "Wholesale"],
      { maxItems: 6, maxItemLength: 120 }
    ),
    stats: normalizeStatArray(input.stats ?? current?.stats ?? [])
  };

  if (!payload.name || !payload.slug) {
    throw new HttpError(400, "分类名称和 Slug 不能为空。");
  }

  if (current) {
    await query(
      `UPDATE categories
       SET name = ?, slug = ?, parent_label = ?, sort_order = ?, enabled = ?, seo_title = ?, summary = ?, banner_title = ?, banner_text = ?, visual_class = ?, highlights_json = ?, stats_json = ?
       WHERE id = ?`,
      [
        payload.name,
        payload.slug,
        payload.parent,
        payload.sortOrder,
        payload.enabled ? 1 : 0,
        payload.seoTitle,
        payload.summary,
        payload.bannerTitle,
        payload.bannerText,
        payload.visualClass,
        stringifyJson(payload.highlights),
        stringifyJson(payload.stats),
        payload.id
      ]
    );
  } else {
    await query(
      `INSERT INTO categories (
         id, name, slug, parent_label, sort_order, enabled, seo_title, summary, banner_title, banner_text, visual_class, highlights_json, stats_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        payload.name,
        payload.slug,
        payload.parent,
        payload.sortOrder,
        payload.enabled ? 1 : 0,
        payload.seoTitle,
        payload.summary,
        payload.bannerTitle,
        payload.bannerText,
        payload.visualClass,
        stringifyJson(payload.highlights),
        stringifyJson(payload.stats)
      ]
    );
  }

  return getCategoryById(payload.id);
}

async function saveProduct(input) {
  const current = input.id ? await getProductById(input.id) : null;
  const slug = slugify(input.slug || input.title, current?.slug || "");
  const tags = normalizeStringArray(input.tags ?? current?.tags ?? [], {
    maxItems: 8,
    maxItemLength: 40
  });
  const summary = sanitizeText(input.summary, {
    max: 500,
    defaultValue: current?.summary || ""
  });

  const payload = {
    id: ensureId(input.id, "prd"),
    title: sanitizeString(input.title, { max: 180 }),
    slug,
    sku: sanitizeString(input.sku, { max: 120 }),
    categoryId: sanitizeString(input.categoryId, { max: 40 }),
    price: normalizeNumber(input.price, {
      min: 0,
      max: 999999,
      defaultValue: current?.price || 0
    }),
    compareAtPrice: normalizeNumber(input.compareAtPrice, {
      min: 0,
      max: 999999,
      defaultValue: current?.compareAtPrice || 0
    }),
    stock: normalizeInteger(input.stock, {
      min: 0,
      max: 999999,
      defaultValue: current?.stock || 0
    }),
    weight: sanitizeString(input.weight, {
      max: 60,
      defaultValue: current?.weight || ""
    }),
    status: normalizeEnum(input.status, ["draft", "published", "archived"], current?.status || "draft"),
    tags,
    heroImage: sanitizeString(input.heroImage, {
      max: 255,
      defaultValue: current?.heroImage || ""
    }),
    gallery: normalizeStringArray(input.gallery ?? current?.gallery ?? [], {
      maxItems: 8,
      maxItemLength: 255
    }),
    summary,
    description: sanitizeText(input.description, {
      max: 1200,
      defaultValue: current?.description || summary
    }),
    tagLabel: sanitizeString(input.tagLabel, {
      max: 80,
      defaultValue: current?.tagLabel || tags[0] || "Catalog"
    }),
    orderMinimum: sanitizeString(input.orderMinimum, {
      max: 80,
      defaultValue: current?.orderMinimum || "24 sets"
    }),
    leadTime: sanitizeString(input.leadTime, {
      max: 120,
      defaultValue: current?.leadTime || "10-15 business days"
    }),
    sportType: sanitizeString(input.sportType, {
      max: 80,
      defaultValue: current?.sportType || "Multi-Sport"
    }),
    audience: sanitizeString(input.audience, {
      max: 120,
      defaultValue: current?.audience || "Retail / Wholesale"
    }),
    useCase: sanitizeString(input.useCase, {
      max: 120,
      defaultValue: current?.useCase || "Catalog Entry"
    }),
    visualClass: sanitizeString(input.visualClass, {
      max: 120,
      defaultValue: current?.visualClass || inferProductVisual(slug)
    }),
    highlights: normalizeStringArray(
      input.highlights ?? current?.highlights ?? [summary || "Core product highlight"],
      { maxItems: 6, maxItemLength: 140 }
    ),
    specifications: normalizeSpecificationArray(
      input.specifications ??
        current?.specifications ?? [
          { label: "SKU", value: sanitizeString(input.sku, { max: 120 }) },
          { label: "Weight", value: sanitizeString(input.weight, { max: 60 }) }
        ]
    ),
    applications: normalizeStringArray(
      input.applications ?? current?.applications ?? [current?.useCase || "General use"],
      { maxItems: 6, maxItemLength: 140 }
    ),
    shipping: sanitizeText(input.shipping, {
      max: 600,
      defaultValue: current?.shipping || "Standard export packaging available."
    }),
    support: sanitizeText(input.support, {
      max: 600,
      defaultValue: current?.support || "Wholesale support available on request."
    }),
    relatedSlugs: normalizeStringArray(input.relatedSlugs ?? current?.relatedSlugs ?? [], {
      maxItems: 8,
      maxItemLength: 180
    }),
    featured: normalizeBoolean(input.featured, current?.featured ?? tags.includes("Best Seller")),
    buyAction: {
      label: sanitizeString(input.buyButtonLabel, {
        max: 80,
        defaultValue: current?.buyButtonLabel || "Go To Buy"
      }),
      url: sanitizeString(input.buyButtonUrl, {
        max: 255,
        defaultValue: current?.buyButtonUrl || "/buy"
      })
    }
  };

  if (!payload.title || !payload.slug || !payload.sku || !payload.categoryId) {
    throw new HttpError(400, "商品标题、Slug、SKU、分类不能为空。");
  }

  if (current) {
    await query(
      `UPDATE products
       SET title = ?, slug = ?, sku = ?, category_id = ?, price = ?, compare_at_price = ?, stock = ?, weight = ?, status = ?, tags_json = ?, hero_image = ?, gallery_json = ?, summary = ?, description = ?, tag_label = ?, order_minimum = ?, lead_time = ?, sport_type = ?, audience = ?, use_case = ?, visual_class = ?, highlights_json = ?, specifications_json = ?, applications_json = ?, shipping = ?, support = ?, related_slugs_json = ?, buy_action_json = ?, featured = ?
       WHERE id = ?`,
      [
        payload.title,
        payload.slug,
        payload.sku,
        payload.categoryId,
        payload.price,
        payload.compareAtPrice,
        payload.stock,
        payload.weight,
        payload.status,
        stringifyJson(payload.tags),
        payload.heroImage,
        stringifyJson(payload.gallery),
        payload.summary,
        payload.description,
        payload.tagLabel,
        payload.orderMinimum,
        payload.leadTime,
        payload.sportType,
        payload.audience,
        payload.useCase,
        payload.visualClass,
        stringifyJson(payload.highlights),
        stringifyJson(payload.specifications),
        stringifyJson(payload.applications),
        payload.shipping,
        payload.support,
        stringifyJson(payload.relatedSlugs),
        stringifyJson(payload.buyAction),
        payload.featured ? 1 : 0,
        payload.id
      ]
    );
  } else {
    await query(
      `INSERT INTO products (
         id, title, slug, sku, category_id, price, compare_at_price, stock, weight, status, tags_json, hero_image, gallery_json, summary, description, tag_label, order_minimum, lead_time, sport_type, audience, use_case, visual_class, highlights_json, specifications_json, applications_json, shipping, support, related_slugs_json, buy_action_json, featured
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        payload.title,
        payload.slug,
        payload.sku,
        payload.categoryId,
        payload.price,
        payload.compareAtPrice,
        payload.stock,
        payload.weight,
        payload.status,
        stringifyJson(payload.tags),
        payload.heroImage,
        stringifyJson(payload.gallery),
        payload.summary,
        payload.description,
        payload.tagLabel,
        payload.orderMinimum,
        payload.leadTime,
        payload.sportType,
        payload.audience,
        payload.useCase,
        payload.visualClass,
        stringifyJson(payload.highlights),
        stringifyJson(payload.specifications),
        stringifyJson(payload.applications),
        payload.shipping,
        payload.support,
        stringifyJson(payload.relatedSlugs),
        stringifyJson(payload.buyAction),
        payload.featured ? 1 : 0
      ]
    );
  }

  return getProductById(payload.id);
}

async function saveVideo(input) {
  const current = input.id ? await getVideoById(input.id) : null;
  const slug = slugify(input.slug || input.title, current?.slug || "");
  const topic = sanitizeString(input.topic, {
    max: 120,
    defaultValue: current?.topic || "General"
  });

  const payload = {
    id: ensureId(input.id, "vid"),
    title: sanitizeString(input.title, { max: 180 }),
    slug,
    categoryId: sanitizeString(input.categoryId, { max: 40 }),
    topic,
    topicSlug: slugify(input.topicSlug || topic, current?.topicSlug || "general"),
    duration: sanitizeString(input.duration, {
      max: 40,
      defaultValue: current?.duration || "00:00"
    }),
    status: normalizeEnum(input.status, ["draft", "published"], current?.status || "draft"),
    cover: sanitizeString(input.cover, { max: 255, defaultValue: current?.cover || "" }),
    videoUrl: sanitizeString(input.videoUrl, {
      max: 255,
      defaultValue: current?.videoUrl || ""
    }),
    summary: sanitizeText(input.summary, {
      max: 500,
      defaultValue: current?.summary || ""
    }),
    tagLabel: sanitizeString(input.tagLabel, {
      max: 80,
      defaultValue: current?.tagLabel || topic
    }),
    visualClass: sanitizeString(input.visualClass, {
      max: 120,
      defaultValue: current?.visualClass || inferVideoVisual(slug)
    }),
    featured: normalizeBoolean(input.featured, current?.featured ?? false)
  };

  if (!payload.title || !payload.slug || !payload.categoryId) {
    throw new HttpError(400, "视频标题、Slug、分类不能为空。");
  }

  if (current) {
    await query(
      `UPDATE videos
       SET title = ?, slug = ?, category_id = ?, topic = ?, topic_slug = ?, duration = ?, status = ?, cover = ?, video_url = ?, summary = ?, tag_label = ?, visual_class = ?, featured = ?
       WHERE id = ?`,
      [
        payload.title,
        payload.slug,
        payload.categoryId,
        payload.topic,
        payload.topicSlug,
        payload.duration,
        payload.status,
        payload.cover,
        payload.videoUrl,
        payload.summary,
        payload.tagLabel,
        payload.visualClass,
        payload.featured ? 1 : 0,
        payload.id
      ]
    );
  } else {
    await query(
      `INSERT INTO videos (
         id, title, slug, category_id, topic, topic_slug, duration, status, cover, video_url, summary, tag_label, visual_class, featured
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        payload.title,
        payload.slug,
        payload.categoryId,
        payload.topic,
        payload.topicSlug,
        payload.duration,
        payload.status,
        payload.cover,
        payload.videoUrl,
        payload.summary,
        payload.tagLabel,
        payload.visualClass,
        payload.featured ? 1 : 0
      ]
    );
  }

  return getVideoById(payload.id);
}

async function saveBlog(input) {
  const current = input.id ? await getBlogById(input.id) : null;
  const title = sanitizeString(input.title, { max: 200 });

  const payload = {
    id: ensureId(input.id, "blog"),
    title,
    slug: slugify(input.slug || title, current?.slug || ""),
    category: sanitizeString(input.category, { max: 120 }),
    author: sanitizeString(input.author, { max: 120 }),
    status: normalizeEnum(input.status, ["draft", "published"], current?.status || "draft"),
    publishDate: sanitizeString(input.publishDate, {
      max: 20,
      defaultValue: current?.publishDate || new Date().toISOString().slice(0, 10)
    }),
    excerpt: sanitizeText(input.excerpt, { max: 600 }),
    body: normalizeStringArray(input.body ?? current?.body ?? [input.excerpt || ""], {
      maxItems: 20,
      maxItemLength: 1200
    }),
    meta: sanitizeString(input.meta, {
      max: 180,
      defaultValue:
        current?.meta ||
        `${sanitizeString(input.author, { max: 120 })} / ${sanitizeString(input.publishDate, { max: 20 })}`
    })
  };

  if (!payload.title || !payload.slug || !payload.category || !payload.author) {
    throw new HttpError(400, "文章标题、Slug、分类、作者不能为空。");
  }

  if (current) {
    await query(
      `UPDATE blogs
       SET title = ?, slug = ?, category = ?, author = ?, status = ?, publish_date = ?, excerpt = ?, body_json = ?, meta = ?
       WHERE id = ?`,
      [
        payload.title,
        payload.slug,
        payload.category,
        payload.author,
        payload.status,
        payload.publishDate,
        payload.excerpt,
        stringifyJson(payload.body),
        payload.meta,
        payload.id
      ]
    );
  } else {
    await query(
      `INSERT INTO blogs (
         id, title, slug, category, author, status, publish_date, excerpt, body_json, meta
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        payload.title,
        payload.slug,
        payload.category,
        payload.author,
        payload.status,
        payload.publishDate,
        payload.excerpt,
        stringifyJson(payload.body),
        payload.meta
      ]
    );
  }

  return getBlogById(payload.id);
}

async function deleteCategory(id) {
  const countRows = await query(`SELECT COUNT(*) AS count FROM products WHERE category_id = ?`, [
    id
  ]);

  if (Number(countRows[0]?.count || 0) > 0) {
    throw new HttpError(400, "该分类下仍有关联商品，不能直接删除。");
  }

  await query(`DELETE FROM categories WHERE id = ?`, [id]);
}

async function deleteProduct(id) {
  await query(`DELETE FROM products WHERE id = ?`, [id]);
}

async function deleteVideo(id) {
  await query(`DELETE FROM videos WHERE id = ?`, [id]);
}

async function deleteBlog(id) {
  await query(`DELETE FROM blogs WHERE id = ?`, [id]);
}

module.exports = {
  getCategories,
  getProducts,
  getVideos,
  getBlogs,
  getCatalogBundle,
  saveCategory,
  saveProduct,
  saveVideo,
  saveBlog,
  deleteCategory,
  deleteProduct,
  deleteVideo,
  deleteBlog
};
