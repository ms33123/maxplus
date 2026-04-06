import type { CatalogProduct } from "../../types/catalog";
import type { RawProduct } from "./types";

export function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function formatPrice(value: number): string {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

export function formatComparePrice(value: number): string {
  return Number.isInteger(value) ? `$${value} MSRP` : `$${value.toFixed(2)} MSRP`;
}

export function mapStockStatus(stock: number): CatalogProduct["stockStatus"] {
  if (stock > 100) {
    return "In Stock";
  }

  if (stock > 0) {
    return "Limited Stock";
  }

  return "Made To Order";
}

export function inferGalleryClasses(product: RawProduct): string[] {
  if (product.visualClass?.includes("cones")) {
    return [
      "catalog-gallery__item--cone-main",
      "catalog-gallery__item--cone-session",
      "catalog-gallery__item--cone-pack"
    ];
  }

  if (product.visualClass?.includes("bands")) {
    return [
      "catalog-gallery__item--band-main",
      "catalog-gallery__item--band-routine",
      "catalog-gallery__item--band-pack"
    ];
  }

  if (product.visualClass?.includes("balls")) {
    return [
      "catalog-gallery__item--ball-main",
      "catalog-gallery__item--ball-club",
      "catalog-gallery__item--ball-pack"
    ];
  }

  return [
    "catalog-gallery__item--net-main",
    "catalog-gallery__item--net-detail",
    "catalog-gallery__item--net-pack"
  ];
}

export function buildVideoRoute(slug: string): string {
  return `/videos/${encodeURIComponent(slug)}`;
}

export function buildProductRoute(slug: string): string {
  return `/products/${encodeURIComponent(slug)}`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
