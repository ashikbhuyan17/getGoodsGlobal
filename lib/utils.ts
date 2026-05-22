import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** 3 min — category, subcategory, menu, layout (changes rarely) */
export const REVALIDATE_CATALOG = 180;

/** 1 min — product lists (price/stock may update sooner) */
export const REVALIDATE_PRODUCTS = 60;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format number as price string with 2 decimal places, truncated not rounded (e.g. 976.4999… → 976.49). */
export function formatPrice(value: number | string): string {
  const n = Number(value);
  const truncated = Math.floor(n * 100) / 100;
  return truncated.toFixed(2);
}

/** Format number as integer price string (nearest integer). Example: 4.56 → 5, 4.49 → 4. */
export function formatPriceInt(value: number | string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return String(Math.round(n));
}

/** Discount percentage from old and new price. Returns 0 if no valid discount. */
export function getDiscountPercent(newPrice: number, oldPrice: number): number {
  const newP = Number(newPrice);
  const oldP = Number(oldPrice);
  if (oldP <= 0 || newP >= oldP) return 0;
  return Math.round(((oldP - newP) / oldP) * 100);
}

export type BulkTierInput = {
  min_qty?: string | number;
  max_qty?: string | number;
  price?: string | number;
  flash_sale_price?: string | number | null;
};

export type ActiveBulkTier = {
  price: number;
  /** When set, use as sale unit price; `price` is the regular bulk price. */
  flashSalePrice: number | null;
  min_qty: number;
  max_qty: number;
};

function parseBulkFlashSale(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * Active bulk tier for totalQuantity.
 * - Prefer a tier with min_qty <= qty <= max_qty (highest min_qty if several match).
 * - If order size is above every max_qty (e.g. 151 when last max is 150), use the best
 *   tier still unlocked: highest min_qty where qty >= min_qty (not capped by max_qty).
 *   Quantity limits stay stock-based in the UI, not max_qty.
 */
export function getActiveBulkTier(
  bulkQuantities: { data?: BulkTierInput[] } | null | undefined,
  totalQuantity: number,
): ActiveBulkTier | null {
  const list = bulkQuantities?.data;
  if (!list || !Array.isArray(list) || list.length === 0) return null;
  const sorted = [...list].sort(
    (a, b) => Number(a?.min_qty ?? 0) - Number(b?.min_qty ?? 0),
  );
  const toTier = (tier: BulkTierInput): ActiveBulkTier => ({
    price: Number(tier?.price ?? 0),
    flashSalePrice: parseBulkFlashSale(tier?.flash_sale_price),
    min_qty: Number(tier?.min_qty ?? 0),
    max_qty: Number(tier?.max_qty ?? 0),
  });
  // totalQuantity 0: show first tier for display
  if (totalQuantity <= 0) {
    return toTier(sorted[0]);
  }
  let inRange: BulkTierInput | null = null;
  for (const tier of sorted) {
    const min = Number(tier?.min_qty ?? 0);
    const max = Number(tier?.max_qty ?? 999999);
    if (totalQuantity >= min && totalQuantity <= max) {
      inRange = tier;
    }
  }
  if (inRange) {
    return toTier(inRange);
  }
  // Above last max_qty or gap: last tier whose min_qty is satisfied (best unlocked price).
  let unlocked: BulkTierInput | null = null;
  for (const tier of sorted) {
    const min = Number(tier?.min_qty ?? 0);
    if (totalQuantity >= min) {
      unlocked = tier;
    }
  }
  return toTier(unlocked ?? sorted[sorted.length - 1]);
}
