const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const { env } = require("../config/env");
const { query } = require("../config/database");
const { stringifyJson } = require("../utils/json");
const { encryptField, decryptField } = require("../security/hybridCrypto");
const {
  seedAdminUsers,
  seedSiteSettings,
  seedHomeContent,
  seedCategories,
  seedProducts,
  seedVideos,
  seedBlogs,
  seedSeo,
  seedInquiries,
  seedSubscribers,
  seedLogs
} = require("../constants/seeds");
const { maskEmail } = require("../utils/normalizers");

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
      footer_json JSON NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS home_content (
      id TINYINT PRIMARY KEY,
      hero_slides_json JSON NOT NULL,
      highlights_json JSON NOT NULL,
      featured_product_slugs_json JSON NOT NULL,
      featured_video_slugs_json JSON NOT NULL,
      reviews_json JSON NOT NULL,
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
      summary TEXT NOT NULL,
      banner_title VARCHAR(180) NOT NULL,
      banner_text TEXT NOT NULL,
      visual_class VARCHAR(120) NOT NULL,
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
      category VARCHAR(120) NOT NULL,
      author VARCHAR(120) NOT NULL,
      status VARCHAR(40) NOT NULL,
      publish_date DATE NOT NULL,
      excerpt TEXT NOT NULL,
      body_json JSON NOT NULL,
      meta VARCHAR(180) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_blogs_status (status)
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
    "home_content",
    "reviews_json",
    "`reviews_json` JSON NULL AFTER `featured_video_slugs_json`"
  );
  await query(`UPDATE home_content SET reviews_json = ? WHERE reviews_json IS NULL`, [
    stringifyJson(seedHomeContent.reviews)
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
      `INSERT INTO site_settings (id, brand_json, socials_json, notifications_json, footer_json)
       VALUES (1, ?, ?, ?, ?)`,
      [
        stringifyJson(seedSiteSettings.brand),
        stringifyJson(seedSiteSettings.socials),
        stringifyJson(seedSiteSettings.notifications),
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
         featured_product_slugs_json,
         featured_video_slugs_json,
         reviews_json,
         section_toggles_json
       ) VALUES (1, ?, ?, ?, ?, ?, ?)`,
      [
        stringifyJson(seedHomeContent.heroSlides),
        stringifyJson(seedHomeContent.highlights),
        stringifyJson(seedHomeContent.featuredProductSlugs),
        stringifyJson(seedHomeContent.featuredVideoSlugs),
        stringifyJson(seedHomeContent.reviews),
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
      await query(
        `INSERT INTO categories (
           id,
           name,
           slug,
           parent_label,
           sort_order,
           enabled,
           seo_title,
           summary,
           banner_title,
           banner_text,
           visual_class,
           highlights_json,
           stats_json
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.slug,
          item.parent,
          item.sortOrder,
          item.enabled ? 1 : 0,
          item.seoTitle,
          item.summary,
          item.bannerTitle,
          item.bannerText,
          item.visualClass,
          stringifyJson(item.highlights),
          stringifyJson(item.stats)
        ]
      );
    }
  }

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
           category,
           author,
           status,
           publish_date,
           excerpt,
           body_json,
           meta
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.slug,
          item.category,
          item.author,
          item.status,
          item.publishDate,
          item.excerpt,
          stringifyJson(item.body),
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
           created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
           created_at
         ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          encryptField(item.email),
          maskEmail(item.email),
          item.source,
          encryptField(item.orderNumber),
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
