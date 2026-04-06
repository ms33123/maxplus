const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const { env } = require("../config/env");
const { query } = require("../config/database");
const { stringifyJson } = require("../utils/json");
const { encryptField, decryptField } = require("../security/hybridCrypto");
const {
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
} = require("../constants/seeds");
const { maskEmail } = require("../utils/normalizers");

function buildDefaultCategoryFilterConfig() {
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

function buildSeedCategoryRecord(item, fallbackVisualClass = "catalog-hero__visual--training") {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    parent: item.parent || "顶级分类",
    sortOrder: item.sortOrder || 1,
    enabled: item.enabled ? 1 : 0,
    seoTitle: item.seoTitle || item.name,
    eyebrow: item.eyebrow || "Category",
    summary: item.summary || `${item.name} category content.`,
    bannerTitle: item.bannerTitle || item.name,
    bannerText: item.bannerText || `${item.name} category introduction.`,
    filterConfig: item.filterConfig || buildDefaultCategoryFilterConfig(),
    detailTitle: item.detailTitle || `${item.name} Overview`,
    detailText: item.detailText || item.bannerText || item.summary || `${item.name} category details.`,
    detailPoints: item.detailPoints || item.highlights || [item.name],
    visualClass: item.visualClass || fallbackVisualClass,
    highlights: item.highlights || [item.name],
    stats: item.stats || []
  };
}

function buildSeedBlogCategoryRecord(item) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    sortOrder: item.sortOrder || 1,
    enabled: item.enabled ? 1 : 0,
    seoTitle: item.seoTitle || item.name,
    description: item.description || ""
  };
}

function normalizeSeedBlogBodyHtml(item) {
  if (item.bodyHtml) {
    return item.bodyHtml;
  }

  if (Array.isArray(item.body) && item.body.length) {
    return item.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  return item.excerpt ? `<p>${item.excerpt}</p>` : "";
}

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: env.mysql.host,
    port: env.mysql.port,
    user: env.mysql.user,
    password: env.mysql.password,
    charset: "utf8mb4"
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.mysql.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }
}

async function createTables() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS admin_users (
      id VARCHAR(40) PRIMARY KEY,
      username VARCHAR(80) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(40) NOT NULL,
      status TINYINT(1) NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      last_login_at DATETIME NULL
    )`,
    `CREATE TABLE IF NOT EXISTS site_settings (
      id TINYINT PRIMARY KEY,
      brand_json JSON NOT NULL,
      socials_json JSON NOT NULL,
      notifications_json JSON NOT NULL,
      brand_story_json JSON NOT NULL,
      blog_page_json JSON NOT NULL,
      subscribe_popup_json JSON NOT NULL,
      mailer_json JSON NOT NULL,
      footer_json JSON NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS home_content (
      id TINYINT PRIMARY KEY,
      hero_slides_json JSON NOT NULL,
      highlights_json JSON NOT NULL,
      product_section_json JSON NOT NULL,
      featured_product_slugs_json JSON NOT NULL,
      video_section_json JSON NOT NULL,
      featured_video_slugs_json JSON NOT NULL,
      category_section_json JSON NOT NULL,
      reviews_json JSON NOT NULL,
      contact_section_json JSON NOT NULL,
      section_toggles_json JSON NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS seo_settings (
      id TINYINT PRIMARY KEY,
      config_json JSON NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(160) NOT NULL UNIQUE,
      parent_label VARCHAR(120) NOT NULL,
      sort_order INT NOT NULL DEFAULT 1,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      seo_title VARCHAR(180) NOT NULL,
      eyebrow VARCHAR(80) NOT NULL,
      summary TEXT NOT NULL,
      banner_title VARCHAR(180) NOT NULL,
      banner_text TEXT NOT NULL,
      filter_config_json JSON NOT NULL,
      detail_title VARCHAR(180) NOT NULL,
      detail_text TEXT NOT NULL,
      visual_class VARCHAR(120) NOT NULL,
      detail_points_json JSON NOT NULL,
      highlights_json JSON NOT NULL,
      stats_json JSON NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS video_categories (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(160) NOT NULL UNIQUE,
      parent_label VARCHAR(120) NOT NULL,
      sort_order INT NOT NULL DEFAULT 1,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      seo_title VARCHAR(180) NOT NULL,
      eyebrow VARCHAR(80) NOT NULL,
      summary TEXT NOT NULL,
      banner_title VARCHAR(180) NOT NULL,
      banner_text TEXT NOT NULL,
      detail_title VARCHAR(180) NOT NULL,
      detail_text TEXT NOT NULL,
      visual_class VARCHAR(120) NOT NULL,
      detail_points_json JSON NOT NULL,
      highlights_json JSON NOT NULL,
      stats_json JSON NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(40) PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      slug VARCHAR(180) NOT NULL UNIQUE,
      sku VARCHAR(120) NOT NULL UNIQUE,
      category_id VARCHAR(40) NOT NULL,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      compare_at_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      stock INT NOT NULL DEFAULT 0,
      weight VARCHAR(60) NOT NULL,
      status VARCHAR(40) NOT NULL,
      tags_json JSON NOT NULL,
      hero_image TEXT NOT NULL,
      gallery_json JSON NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      tag_label VARCHAR(80) NOT NULL,
      order_minimum VARCHAR(80) NOT NULL,
      lead_time VARCHAR(120) NOT NULL,
      sport_type VARCHAR(80) NOT NULL,
      audience VARCHAR(120) NOT NULL,
      use_case VARCHAR(120) NOT NULL,
      visual_class VARCHAR(120) NOT NULL,
      highlights_json JSON NOT NULL,
      specifications_json JSON NOT NULL,
      applications_json JSON NOT NULL,
      shipping TEXT NOT NULL,
      support TEXT NOT NULL,
      related_slugs_json JSON NOT NULL,
      buy_action_json JSON NOT NULL,
      featured TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_products_category_id (category_id),
      INDEX idx_products_status (status)
    )`,
    `CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(40) PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      slug VARCHAR(180) NOT NULL UNIQUE,
      category_id VARCHAR(40) NOT NULL,
      topic VARCHAR(120) NOT NULL,
      topic_slug VARCHAR(120) NOT NULL,
      duration VARCHAR(40) NOT NULL,
      status VARCHAR(40) NOT NULL,
      cover TEXT NOT NULL,
      video_url TEXT NOT NULL,
      summary TEXT NOT NULL,
      tag_label VARCHAR(80) NOT NULL,
      visual_class VARCHAR(120) NOT NULL,
      featured TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_videos_category_id (category_id),
      INDEX idx_videos_status (status)
    )`,
    `CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(40) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) NOT NULL UNIQUE,
      category_id VARCHAR(40) NOT NULL,
      category VARCHAR(120) NOT NULL,
      author VARCHAR(120) NOT NULL,
      status VARCHAR(40) NOT NULL,
      publish_date DATE NOT NULL,
      excerpt TEXT NOT NULL,
      cover_image TEXT NULL,
      body_json JSON NOT NULL,
      content_html LONGTEXT NOT NULL,
      meta VARCHAR(180) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_blogs_category_id (category_id),
      INDEX idx_blogs_status (status)
    )`,
    `CREATE TABLE IF NOT EXISTS blog_categories (
      id VARCHAR(40) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      slug VARCHAR(160) NOT NULL UNIQUE,
      sort_order INT NOT NULL DEFAULT 1,
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      seo_title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(40) PRIMARY KEY,
      source VARCHAR(40) NOT NULL,
      customer VARCHAR(120) NOT NULL,
      email_cipher TEXT NOT NULL,
      email_mask VARCHAR(100) NOT NULL,
      company VARCHAR(160) NOT NULL,
      status VARCHAR(40) NOT NULL,
      assignee VARCHAR(120) NOT NULL,
      source_detail VARCHAR(200) NOT NULL,
      message_cipher LONGTEXT NOT NULL,
      metadata_json JSON NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_inquiries_status (status)
    )`,
    `CREATE TABLE IF NOT EXISTS subscribers (
      id VARCHAR(40) PRIMARY KEY,
      email_cipher TEXT NOT NULL,
      email_mask VARCHAR(100) NOT NULL,
      source VARCHAR(120) NOT NULL,
      order_number_cipher TEXT NOT NULL,
      metadata_json JSON NULL,
      confirmation_status VARCHAR(40) NOT NULL DEFAULT 'pending',
      confirmation_sent_at DATETIME NULL,
      confirmation_error TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS logs (
      id VARCHAR(40) PRIMARY KEY,
      type VARCHAR(40) NOT NULL,
      actor VARCHAR(120) NOT NULL,
      role VARCHAR(40) NOT NULL,
      message TEXT NOT NULL,
      metadata_json JSON NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_logs_type (type)
    )`
  ];

  for (const statement of statements) {
    await query(statement);
  }
}

async function ensureColumnExists(tableName, columnName, definitionSql) {
  const rows = await query(
    `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1`,
    [tableName, columnName]
  );

  if (rows.length > 0) {
    return;
  }

  await query(`ALTER TABLE \`${tableName}\` ADD COLUMN ${definitionSql}`);
}

async function migrateSchema() {
  await ensureColumnExists(
    "inquiries",
    "metadata_json",
    "`metadata_json` JSON NULL AFTER `message_cipher`"
  );

  await ensureColumnExists(
    "site_settings",
    "brand_story_json",
    "`brand_story_json` JSON NULL AFTER `notifications_json`"
  );
  await query(`UPDATE site_settings SET brand_story_json = ? WHERE brand_story_json IS NULL`, [
    stringifyJson(seedBrandStory)
  ]);

  await ensureColumnExists(
    "site_settings",
    "blog_page_json",
    "`blog_page_json` JSON NULL AFTER `brand_story_json`"
  );
  await query(`UPDATE site_settings SET blog_page_json = ? WHERE blog_page_json IS NULL`, [
    stringifyJson(seedBlogPage)
  ]);

  await ensureColumnExists(
    "site_settings",
    "subscribe_popup_json",
    "`subscribe_popup_json` JSON NULL AFTER `blog_page_json`"
  );
  await query(`UPDATE site_settings SET subscribe_popup_json = ? WHERE subscribe_popup_json IS NULL`, [
    stringifyJson(seedSubscribePopup)
  ]);

  await ensureColumnExists(
    "site_settings",
    "mailer_json",
    "`mailer_json` JSON NULL AFTER `subscribe_popup_json`"
  );
  await query(`UPDATE site_settings SET mailer_json = ? WHERE mailer_json IS NULL`, [
    stringifyJson(seedSiteSettings.mailer)
  ]);

  await ensureColumnExists(
    "home_content",
    "product_section_json",
    "`product_section_json` JSON NULL AFTER `highlights_json`"
  );
  await query(`UPDATE home_content SET product_section_json = ? WHERE product_section_json IS NULL`, [
    stringifyJson(seedHomeContent.productSection)
  ]);

  await ensureColumnExists(
    "home_content",
    "video_section_json",
    "`video_section_json` JSON NULL AFTER `featured_product_slugs_json`"
  );
  await query(`UPDATE home_content SET video_section_json = ? WHERE video_section_json IS NULL`, [
    stringifyJson(seedHomeContent.videoSection)
  ]);

  await ensureColumnExists(
    "home_content",
    "category_section_json",
    "`category_section_json` JSON NULL AFTER `featured_video_slugs_json`"
  );
  await query(`UPDATE home_content SET category_section_json = ? WHERE category_section_json IS NULL`, [
    stringifyJson(seedHomeContent.categorySection)
  ]);

  await ensureColumnExists(
    "home_content",
    "reviews_json",
    "`reviews_json` JSON NULL AFTER `category_section_json`"
  );
  await query(`UPDATE home_content SET reviews_json = ? WHERE reviews_json IS NULL`, [
    stringifyJson(seedHomeContent.reviews)
  ]);

  await ensureColumnExists(
    "home_content",
    "contact_section_json",
    "`contact_section_json` JSON NULL AFTER `reviews_json`"
  );
  await query(`UPDATE home_content SET contact_section_json = ? WHERE contact_section_json IS NULL`, [
    stringifyJson(seedHomeContent.contactSection)
  ]);

  await ensureColumnExists(
    "products",
    "buy_action_json",
    "`buy_action_json` JSON NULL AFTER `related_slugs_json`"
  );
  await query(`UPDATE products SET buy_action_json = ? WHERE buy_action_json IS NULL`, [
    stringifyJson({
      label: "Go To Buy",
      url: "/buy"
    })
  ]);

  for (const tableName of ["categories", "video_categories"]) {
    await ensureColumnExists(tableName, "eyebrow", "`eyebrow` VARCHAR(80) NULL AFTER `seo_title`");
    await ensureColumnExists(tableName, "detail_title", "`detail_title` VARCHAR(180) NULL AFTER `banner_text`");
    await ensureColumnExists(tableName, "detail_text", "`detail_text` TEXT NULL AFTER `detail_title`");
    await ensureColumnExists(
      tableName,
      "detail_points_json",
      "`detail_points_json` JSON NULL AFTER `visual_class`"
    );

    await query(`UPDATE \`${tableName}\` SET eyebrow = 'Category' WHERE eyebrow IS NULL OR eyebrow = ''`);
    await query(
      `UPDATE \`${tableName}\`
          SET detail_title = COALESCE(NULLIF(banner_title, ''), name)
        WHERE detail_title IS NULL OR detail_title = ''`
    );
    await query(
      `UPDATE \`${tableName}\`
          SET detail_text = COALESCE(NULLIF(banner_text, ''), NULLIF(summary, ''), CONCAT(name, ' category details.'))
        WHERE detail_text IS NULL OR detail_text = ''`
    );
    await query(
      `UPDATE \`${tableName}\`
          SET detail_points_json = highlights_json
        WHERE detail_points_json IS NULL`
    );
  }

  await ensureColumnExists(
    "categories",
    "filter_config_json",
    "`filter_config_json` JSON NULL AFTER `banner_text`"
  );
  await query(`UPDATE categories SET filter_config_json = ? WHERE filter_config_json IS NULL`, [
    stringifyJson(buildDefaultCategoryFilterConfig())
  ]);

  await ensureColumnExists(
    "subscribers",
    "metadata_json",
    "`metadata_json` JSON NULL AFTER `order_number_cipher`"
  );
  await ensureColumnExists(
    "subscribers",
    "confirmation_status",
    "`confirmation_status` VARCHAR(40) NOT NULL DEFAULT 'pending' AFTER `metadata_json`"
  );
  await ensureColumnExists(
    "subscribers",
    "confirmation_sent_at",
    "`confirmation_sent_at` DATETIME NULL AFTER `confirmation_status`"
  );
  await ensureColumnExists(
    "subscribers",
    "confirmation_error",
    "`confirmation_error` TEXT NULL AFTER `confirmation_sent_at`"
  );

  await ensureColumnExists(
    "blogs",
    "category_id",
    "`category_id` VARCHAR(40) NULL AFTER `slug`"
  );
  await ensureColumnExists(
    "blogs",
    "cover_image",
    "`cover_image` TEXT NULL AFTER `excerpt`"
  );
  await ensureColumnExists(
    "blogs",
    "content_html",
    "`content_html` LONGTEXT NULL AFTER `body_json`"
  );
  await query(
    `UPDATE blogs
        SET content_html = CONCAT('<p>', excerpt, '</p>')
      WHERE (content_html IS NULL OR content_html = '')
        AND excerpt IS NOT NULL
        AND excerpt <> ''`
  );

  const existingBlogCategoryRows = await query(
    `SELECT DISTINCT category
       FROM blogs
      WHERE category IS NOT NULL
        AND category <> ''`
  );

  for (const row of existingBlogCategoryRows) {
    const name = String(row.category || "").trim();

    if (!name) {
      continue;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const existing = await query(`SELECT id FROM blog_categories WHERE slug = ? LIMIT 1`, [slug]);

    if (existing.length > 0) {
      continue;
    }

    await query(
      `INSERT INTO blog_categories (
         id, name, slug, sort_order, enabled, seo_title, description
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `bcat-${Date.now()}-${slug || "legacy"}`,
        name,
        slug || `legacy-${Date.now()}`,
        999,
        1,
        name,
        ""
      ]
    );
  }

  await query(
    `UPDATE blogs b
        LEFT JOIN blog_categories bc ON bc.name = b.category
         SET b.category_id = bc.id
      WHERE (b.category_id IS NULL OR b.category_id = '')
        AND bc.id IS NOT NULL`
  );

  const missingVideoCategoryRows = await query(
    `SELECT DISTINCT v.category_id
       FROM videos v
       LEFT JOIN video_categories vc ON vc.id = v.category_id
      WHERE v.category_id IS NOT NULL
        AND v.category_id <> ''
        AND vc.id IS NULL`
  );

  for (const row of missingVideoCategoryRows) {
    const source = await query(`SELECT * FROM categories WHERE id = ? LIMIT 1`, [row.category_id]);

    if (source[0]) {
      await query(
        `INSERT INTO video_categories (
           id, name, slug, parent_label, sort_order, enabled, seo_title, eyebrow, summary, banner_title, banner_text, detail_title, detail_text, visual_class, detail_points_json, highlights_json, stats_json
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          source[0].id,
          source[0].name,
          source[0].slug,
          source[0].parent_label,
          source[0].sort_order,
          source[0].enabled,
          source[0].seo_title,
          source[0].eyebrow || "Category",
          source[0].summary,
          source[0].banner_title,
          source[0].banner_text,
          source[0].detail_title || source[0].banner_title || source[0].name,
          source[0].detail_text || source[0].banner_text || source[0].summary,
          source[0].visual_class,
          source[0].detail_points_json || source[0].highlights_json,
          source[0].highlights_json,
          source[0].stats_json
        ]
      );
      continue;
    }

    const fallback = buildSeedCategoryRecord(
      {
        id: row.category_id,
        name: `Legacy Video Category ${row.category_id}`,
        slug: `legacy-${String(row.category_id).toLowerCase()}`,
        parent: "顶级分类",
        sortOrder: 999,
        enabled: true,
        seoTitle: `Legacy Video Category ${row.category_id}`
      },
      "catalog-hero__visual--training"
    );

    await query(
      `INSERT INTO video_categories (
         id, name, slug, parent_label, sort_order, enabled, seo_title, eyebrow, summary, banner_title, banner_text, detail_title, detail_text, visual_class, detail_points_json, highlights_json, stats_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fallback.id,
        fallback.name,
        fallback.slug,
        fallback.parent,
        fallback.sortOrder,
        fallback.enabled,
        fallback.seoTitle,
        fallback.eyebrow,
        fallback.summary,
        fallback.bannerTitle,
        fallback.bannerText,
        fallback.detailTitle,
        fallback.detailText,
        fallback.visualClass,
        stringifyJson(fallback.detailPoints),
        stringifyJson(fallback.highlights),
        stringifyJson(fallback.stats)
      ]
    );
  }
}

async function tableHasRows(tableName) {
  const rows = await query(`SELECT COUNT(*) AS count FROM ${tableName}`);
  return Number(rows[0]?.count ?? 0) > 0;
}

async function seedAdminTable() {
  if (await tableHasRows("admin_users")) {
    return;
  }

  for (const item of seedAdminUsers) {
    await query(
      `INSERT INTO admin_users (id, username, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [
        `usr-${item.username}`,
        item.username,
        await bcrypt.hash(item.password, 10),
        item.role
      ]
    );
  }
}

async function seedSettingsTables() {
  if (!(await tableHasRows("site_settings"))) {
    await query(
      `INSERT INTO site_settings (id, brand_json, socials_json, notifications_json, brand_story_json, blog_page_json, subscribe_popup_json, mailer_json, footer_json)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stringifyJson(seedSiteSettings.brand),
        stringifyJson(seedSiteSettings.socials),
        stringifyJson(seedSiteSettings.notifications),
        stringifyJson(seedBrandStory),
        stringifyJson(seedBlogPage),
        stringifyJson(seedSubscribePopup),
        stringifyJson(seedSiteSettings.mailer),
        stringifyJson(seedSiteSettings.footer)
      ]
    );
  }

  if (!(await tableHasRows("home_content"))) {
    await query(
      `INSERT INTO home_content (
         id,
         hero_slides_json,
         highlights_json,
         product_section_json,
         featured_product_slugs_json,
         video_section_json,
         featured_video_slugs_json,
         category_section_json,
         reviews_json,
         contact_section_json,
         section_toggles_json
       ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        stringifyJson(seedHomeContent.heroSlides),
        stringifyJson(seedHomeContent.highlights),
        stringifyJson(seedHomeContent.productSection),
        stringifyJson(seedHomeContent.featuredProductSlugs),
        stringifyJson(seedHomeContent.videoSection),
        stringifyJson(seedHomeContent.featuredVideoSlugs),
        stringifyJson(seedHomeContent.categorySection),
        stringifyJson(seedHomeContent.reviews),
        stringifyJson(seedHomeContent.contactSection),
        stringifyJson(seedHomeContent.sectionToggles)
      ]
    );
  }

  if (!(await tableHasRows("seo_settings"))) {
    await query(`INSERT INTO seo_settings (id, config_json) VALUES (1, ?)`, [
      stringifyJson(seedSeo)
    ]);
  }
}

async function seedCatalogTables() {
  if (!(await tableHasRows("categories"))) {
    for (const item of seedCategories) {
      const record = buildSeedCategoryRecord(item, item.visualClass);
      await query(
        `INSERT INTO categories (
           id,
           name,
           slug,
           parent_label,
           sort_order,
           enabled,
           seo_title,
           eyebrow,
           summary,
           banner_title,
           banner_text,
           filter_config_json,
           detail_title,
           detail_text,
           visual_class,
           detail_points_json,
           highlights_json,
           stats_json
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.name,
          record.slug,
          record.parent,
          record.sortOrder,
          record.enabled,
          record.seoTitle,
          record.eyebrow,
          record.summary,
          record.bannerTitle,
          record.bannerText,
          stringifyJson(record.filterConfig),
          record.detailTitle,
          record.detailText,
          record.visualClass,
          stringifyJson(record.detailPoints),
          stringifyJson(record.highlights),
          stringifyJson(record.stats)
        ]
      );
    }
  }

  for (const item of seedVideoCategories) {
    const exists = await query(`SELECT id FROM video_categories WHERE id = ? LIMIT 1`, [item.id]);

    if (exists.length > 0) {
      continue;
    }

    const record = buildSeedCategoryRecord(item, "catalog-hero__visual--training");

    await query(
      `INSERT INTO video_categories (
         id,
         name,
         slug,
         parent_label,
         sort_order,
         enabled,
         seo_title,
         eyebrow,
         summary,
         banner_title,
         banner_text,
         detail_title,
         detail_text,
         visual_class,
         detail_points_json,
         highlights_json,
         stats_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.name,
        record.slug,
        record.parent,
        record.sortOrder,
        record.enabled,
        record.seoTitle,
        record.eyebrow,
        record.summary,
        record.bannerTitle,
        record.bannerText,
        record.detailTitle,
        record.detailText,
        record.visualClass,
        stringifyJson(record.detailPoints),
        stringifyJson(record.highlights),
        stringifyJson(record.stats)
      ]
    );
  }

  for (const item of seedBlogCategories) {
    const record = buildSeedBlogCategoryRecord(item);
    const existsById = await query(`SELECT id FROM blog_categories WHERE id = ? LIMIT 1`, [record.id]);

    if (existsById.length > 0) {
      await query(
        `UPDATE blog_categories
            SET name = ?, slug = ?, sort_order = ?, enabled = ?, seo_title = ?, description = ?
          WHERE id = ?`,
        [
          record.name,
          record.slug,
          record.sortOrder,
          record.enabled,
          record.seoTitle,
          record.description,
          record.id
        ]
      );
      continue;
    }

    const existsBySlug = await query(`SELECT id FROM blog_categories WHERE slug = ? LIMIT 1`, [record.slug]);

    if (existsBySlug.length > 0) {
      const legacyId = existsBySlug[0].id;
      await query(`UPDATE blogs SET category_id = ? WHERE category_id = ?`, [record.id, legacyId]);
      await query(
        `UPDATE blog_categories
            SET id = ?, name = ?, slug = ?, sort_order = ?, enabled = ?, seo_title = ?, description = ?
          WHERE id = ?`,
        [
          record.id,
          record.name,
          record.slug,
          record.sortOrder,
          record.enabled,
          record.seoTitle,
          record.description,
          legacyId
        ]
      );
      continue;
    }

    await query(
      `INSERT INTO blog_categories (
         id, name, slug, sort_order, enabled, seo_title, description
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.name,
        record.slug,
        record.sortOrder,
        record.enabled,
        record.seoTitle,
        record.description
      ]
    );
  }

  await query(
    `UPDATE blogs b
        LEFT JOIN blog_categories bc ON bc.name = b.category
         SET b.category_id = bc.id
      WHERE (b.category_id IS NULL OR b.category_id = '')
        AND bc.id IS NOT NULL`
  );

  if (!(await tableHasRows("products"))) {
    for (const item of seedProducts) {
      await query(
        `INSERT INTO products (
           id,
           title,
           slug,
           sku,
           category_id,
           price,
           compare_at_price,
           stock,
           weight,
           status,
           tags_json,
           hero_image,
           gallery_json,
           summary,
           description,
           tag_label,
           order_minimum,
           lead_time,
           sport_type,
           audience,
           use_case,
           visual_class,
           highlights_json,
           specifications_json,
           applications_json,
           shipping,
           support,
           related_slugs_json,
           buy_action_json,
           featured
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.slug,
          item.sku,
          item.categoryId,
          item.price,
          item.compareAtPrice,
          item.stock,
          item.weight,
          item.status,
          stringifyJson(item.tags),
          item.heroImage,
          stringifyJson(item.gallery),
          item.summary,
          item.description,
          item.tagLabel,
          item.orderMinimum,
          item.leadTime,
          item.sportType,
          item.audience,
          item.useCase,
          item.visualClass,
          stringifyJson(item.highlights),
          stringifyJson(item.specifications),
          stringifyJson(item.applications),
          item.shipping,
          item.support,
          stringifyJson(item.relatedSlugs),
          stringifyJson({
            label: item.buyButtonLabel,
            url: item.buyButtonUrl
          }),
          item.featured ? 1 : 0
        ]
      );
    }
  }

  if (!(await tableHasRows("videos"))) {
    for (const item of seedVideos) {
      await query(
        `INSERT INTO videos (
           id,
           title,
           slug,
           category_id,
           topic,
           topic_slug,
           duration,
           status,
           cover,
           video_url,
           summary,
           tag_label,
           visual_class,
           featured
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.slug,
          item.categoryId,
          item.topic,
          item.topicSlug,
          item.duration,
          item.status,
          item.cover,
          item.videoUrl,
          item.summary,
          item.tagLabel,
          item.visualClass,
          item.featured ? 1 : 0
        ]
      );
    }
  }

  if (!(await tableHasRows("blogs"))) {
    for (const item of seedBlogs) {
      await query(
        `INSERT INTO blogs (
           id,
           title,
           slug,
           category_id,
           category,
           author,
           status,
           publish_date,
           excerpt,
           cover_image,
           body_json,
           content_html,
           meta
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.slug,
          item.categoryId,
          item.category,
          item.author,
          item.status,
          item.publishDate,
          item.excerpt,
          item.coverImage || "",
          stringifyJson(item.body),
          normalizeSeedBlogBodyHtml(item),
          item.meta
        ]
      );
    }
  }
}

async function seedCrmTables() {
  if (!(await tableHasRows("inquiries"))) {
    for (const item of seedInquiries) {
      await query(
        `INSERT INTO inquiries (
           id,
           source,
           customer,
           email_cipher,
           email_mask,
           company,
           status,
           assignee,
           source_detail,
           message_cipher,
           metadata_json,
           created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.source,
          item.customer,
          encryptField(item.email),
          maskEmail(item.email),
          item.company,
          item.status,
          item.assignee,
          item.sourceDetail,
          encryptField(item.message),
          null,
          item.createdAt
        ]
      );
    }
  }

  if (!(await tableHasRows("subscribers"))) {
    for (const item of seedSubscribers) {
      await query(
        `INSERT INTO subscribers (
           id,
           email_cipher,
           email_mask,
           source,
           order_number_cipher,
           metadata_json,
           confirmation_status,
           confirmation_sent_at,
           confirmation_error,
           created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          encryptField(item.email),
          maskEmail(item.email),
          item.source,
          encryptField(item.orderNumber),
          item.fields ? stringifyJson(item.fields) : null,
          item.emailStatus || "pending",
          item.emailSentAt || null,
          item.emailError || null,
          item.createdAt
        ]
      );
    }
  }

  if (!(await tableHasRows("logs"))) {
    for (const item of seedLogs) {
      await query(
        `INSERT INTO logs (id, type, actor, role, message, metadata_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.type,
          item.actor,
          item.role,
          item.message,
          item.metadata ? stringifyJson(item.metadata) : null,
          item.createdAt
        ]
      );
    }
  }

  const encryptedSample = encryptField("health-check");
  decryptField(encryptedSample);
}

async function initializeDatabase() {
  await ensureDatabaseExists();
  await createTables();
  await migrateSchema();
  await seedAdminTable();
  await seedSettingsTables();
  await seedCatalogTables();
  await seedCrmTables();
}

module.exports = {
  initializeDatabase
};
