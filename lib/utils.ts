import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

/** Get active bulk tier based on totalQuantity (min_qty <= qty <= max_qty). Returns best tier for display/calculation. */
export function getActiveBulkTier(
  bulkQuantities: { data?: { min_qty?: string | number; max_qty?: string | number; price?: string | number }[] } | null | undefined,
  totalQuantity: number
): { price: number; min_qty: number; max_qty: number } | null {
  const list = bulkQuantities?.data;
  if (!list || !Array.isArray(list) || list.length === 0) return null;
  const sorted = [...list].sort(
    (a, b) => Number(a?.min_qty ?? 0) - Number(b?.min_qty ?? 0)
  );
  // totalQuantity 0: show first tier for display
  if (totalQuantity <= 0) {
    const first = sorted[0];
    return { price: Number(first?.price ?? 0), min_qty: Number(first?.min_qty ?? 0), max_qty: Number(first?.max_qty ?? 0) };
  }
  // Find tier where min_qty <= totalQuantity <= max_qty. Prefer highest min_qty (best price).
  let active = sorted[0];
  for (const tier of sorted) {
    const min = Number(tier?.min_qty ?? 0);
    const max = Number(tier?.max_qty ?? 999999);
    if (totalQuantity >= min && totalQuantity <= max) {
      active = tier;
    }
  }
  return {
    price: Number(active?.price ?? 0),
    min_qty: Number(active?.min_qty ?? 0),
    max_qty: Number(active?.max_qty ?? 0),
  };
}
