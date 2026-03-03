import {
  productApiResponseSchema,
  type ProductApiResponse,
} from './schemas/product';

export type FlashSaleData = {
  id?: number;
  flash_sale_title?: string;
  flash_sale_percentage?: string;
  flash_sale_start_date?: string;
  flash_sale_end_date?: string;
} | null;

export type NormalizedProductData = {
  data: {
    product: ProductApiResponse['product'];
    productColors: ProductApiResponse['productColors'];
    shippingCharge: ProductApiResponse['shippingCharge'];
    flashSale: FlashSaleData;
  };
};

/**
 * Normalizes product API response to { data: { product, productColors, shippingCharge } }.
 * Handles both formats:
 * - { data: { product, shippingCharge, productColors } }
 * - { product, shippingCharge, productColors }
 */
export function normalizeProductResponse(
  raw: unknown,
): NormalizedProductData | null {
  if (!raw || typeof raw !== 'object') return null;

  const obj = raw as Record<string, unknown>;
  const data = (obj.data as Record<string, unknown>) ?? obj;

  const product = data.product ?? data.Product;
  const productColors = data.productColors ?? data.productcolors ?? [];
  const shippingCharge = data.shippingCharge ?? data.shippingcharge ?? [];
  const flashSale = data.flashSale ?? data.flash_sale ?? null;

  if (!product) return null;

  const normalized = {
    product,
    productColors: Array.isArray(productColors) ? productColors : [],
    shippingCharge: Array.isArray(shippingCharge) ? shippingCharge : [],
    flashSale: flashSale && typeof flashSale === 'object' ? flashSale : null,
  };

  const parsed = productApiResponseSchema.safeParse(normalized);
  if (parsed.success) {
    return {
      data: {
        product: parsed.data.product,
        productColors: parsed.data.productColors,
        shippingCharge: parsed.data.shippingCharge,
        flashSale: (parsed.data.flashSale ?? null) as FlashSaleData,
      },
    };
  }

  return {
    data: {
      product: product as ProductApiResponse['product'],
      productColors:
        normalized.productColors as ProductApiResponse['productColors'],
      shippingCharge:
        normalized.shippingCharge as ProductApiResponse['shippingCharge'],
      flashSale: normalized.flashSale,
    },
  };
}

/**
 * Check if product API response indicates success.
 */
export function isProductResponseSuccess(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const obj = raw as Record<string, unknown>;
  if (obj.status === 'success' || obj.status === true) return true;
  if (obj.product || (obj.data as Record<string, unknown>)?.product)
    return true;
  return false;
}
