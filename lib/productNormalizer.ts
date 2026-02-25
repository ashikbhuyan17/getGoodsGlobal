import {
  productApiResponseSchema,
  type ProductApiResponse,
} from './schemas/product';

export type NormalizedProductData = {
  data: {
    product: ProductApiResponse['product'];
    productColors: ProductApiResponse['productColors'];
    shippingCharge: ProductApiResponse['shippingCharge'];
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

  if (!product) return null;

  const normalized = {
    product,
    productColors: Array.isArray(productColors) ? productColors : [],
    shippingCharge: Array.isArray(shippingCharge) ? shippingCharge : [],
  };

  const parsed = productApiResponseSchema.safeParse(normalized);
  if (parsed.success) {
    return {
      data: {
        product: parsed.data.product,
        productColors: parsed.data.productColors,
        shippingCharge: parsed.data.shippingCharge,
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
