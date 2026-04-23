'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import ImagePreview from '@/components/common/ImagePreview';

interface ProductVariant {
  color?: string;
  color_image?: string;
  sale_price?: string | number;
  regular_price?: string | number;
  price?: string | number;
  size?: string;
  qty?: string | number;
  product_discount?: number;
  discount?: number;
  china_courier_charge?: number;
}

interface Product {
  product_id?: string;
  product_name?: string;
  slug?: string;
  product_slug?: string;
  variants?: ProductVariant[];
}

interface OrderProductDetailsProps {
  products: Product[];
  orderData?: Record<string, unknown>;
}

const DEFAULT_PRODUCT_IMAGE = '/placeholder-product.png';
const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL || '';

function getVariantImage(variant: ProductVariant): string {
  const img = variant?.color_image;
  if (img) return `${IMG_URL}/${img}`;
  return DEFAULT_PRODUCT_IMAGE;
}

function getProductImage(product: Product): string {
  const first = product?.variants?.[0];
  return first ? getVariantImage(first) : DEFAULT_PRODUCT_IMAGE;
}

/** Sum of qty × sale price for variants (payable subtotal before extra deductions). */
function sumSaleSubtotal(variants: ProductVariant[]): number {
  let s = 0;
  for (const v of variants) {
    const qty = Number(v?.qty ?? 0);
    const sale = Number(v?.sale_price ?? v?.price ?? 0);
    s += qty * sale;
  }
  return s;
}

/**
 * Per-product breakdown. Variant discount amount = (regular_price − sale_price) × qty.
 * Payable total = sale subtotal − extra line discounts − allocated coupon + China courier.
 */
function calculateProductTotals(
  variants: ProductVariant[],
  couponAllocated: number,
) {
  let saleSubtotal = 0;
  /** Savings vs regular list price (informational; line totals already use sale price). */
  let variantPriceDiscount = 0;
  let regularSubtotal = 0;
  let extraLineDiscount = 0;
  let chinaCourier = 0;

  for (const v of variants) {
    const qty = Number(v?.qty ?? 0);
    const sale = Number(v?.sale_price ?? v?.price ?? 0);
    const regular = Number(v?.regular_price ?? 0);
    saleSubtotal += qty * sale;
    if (regular > 0) {
      regularSubtotal += qty * regular;
      if (regular > sale) {
        variantPriceDiscount += (regular - sale) * qty;
      }
    }
    if (v?.product_discount || v?.discount) {
      extraLineDiscount += Number(v.product_discount ?? v.discount ?? 0);
    }
    if (v?.china_courier_charge) {
      chinaCourier += Number(v.china_courier_charge);
    }
  }

  const total =
    saleSubtotal - extraLineDiscount - couponAllocated + chinaCourier;

  const discountPct =
    variantPriceDiscount > 0 && regularSubtotal > 0
      ? Math.round((variantPriceDiscount / regularSubtotal) * 100)
      : null;

  return {
    productPrice: saleSubtotal,
    variantPriceDiscount,
    extraLineDiscount,
    couponAllocated,
    chinaCourier,
    total,
    discountPct,
  };
}

export default function OrderProductDetails({
  products,
  orderData = {},
}: OrderProductDetailsProps) {
  if (!products?.length) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <p className="text-sm text-gray-500">No products found</p>
      </div>
    );
  }

  const couponOrderTotal = Number(orderData?.coupon_discount ?? 0);
  const saleSubtotals = products.map((p) => sumSaleSubtotal(p.variants ?? []));
  const allSaleSubtotal = saleSubtotals.reduce((a, b) => a + b, 0);

  const baseMetrics = products.map((product, index) => {
    const couponAllocated =
      allSaleSubtotal > 0
        ? couponOrderTotal * (saleSubtotals[index] / allSaleSubtotal)
        : 0;
    return calculateProductTotals(product.variants ?? [], couponAllocated);
  });

  const orderNetSum = baseMetrics.reduce((sum, m) => sum + m.total, 0);
  const paidOrder = Number(
    orderData?.paid_partial_payment_amount ??
      orderData?.paid_amount ??
      orderData?.advance_payment ??
      0,
  );

  return (
    <div className="space-y-6">
      {products.map((product, index) => {
        const variants = product.variants ?? [];
        const totals = baseMetrics[index];
        const paidShare =
          orderNetSum > 0 ? paidOrder * (totals.total / orderNetSum) : 0;
        const due = totals.total - paidShare;

        return (
          <div
            key={product.product_id ?? index}
            className="bg-white rounded-lg p-4 md:p-6 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <ImagePreview
                src={getProductImage(product)}
                alt={product.product_name ?? ''}
                width={64}
                height={64}
                className="shrink-0 rounded-lg overflow-hidden"
              />
              <div className="flex-1">
                {(product.slug ?? product.product_slug) ? (
                  <Link
                    href={`/product/${product.slug ?? product.product_slug}`}
                    className="text-sm font-medium text-gray-900 leading-tight hover:text-primary hover:underline"
                  >
                    {product.product_name ?? 'N/A'}
                  </Link>
                ) : (
                  <h4 className="text-sm font-medium text-gray-900 leading-tight">
                    {product.product_name ?? 'N/A'}
                  </h4>
                )}
              </div>
            </div>
            <div className="border-t" />

            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Variant
                    </th>
                    <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">
                      Qty × Price
                    </th>
                    <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, vIndex) => {
                    const price = Number(
                      variant?.sale_price ?? variant?.price ?? 0,
                    );
                    const qty = Number(variant?.qty ?? 0);
                    const total = qty * price;
                    return (
                      <tr
                        key={vIndex}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <ImagePreview
                              src={getVariantImage(variant)}
                              alt={variant?.color ?? ''}
                              width={50}
                              height={50}
                              className="rounded-full overflow-hidden shrink-0"
                            />
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-gray-900">
                                {variant?.color ?? 'N/A'}
                              </span>
                              <span className="text-xs text-gray-500">
                                Size: {variant?.size ?? 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-sm font-medium text-gray-900">
                          {qty} × ৳{price}
                        </td>
                        <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">
                          ৳{total.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4 flex justify-end">
              <div className="space-y-2 w-1/2">
                {/* <div className="flex justify-between font-semibold text-sm">
                  <span className="text-gray-900">Product Price:</span>
                  <span>৳{Math.round(totals.productPrice)}</span>
                </div>
                {totals.variantPriceDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">Discount amount:</span>
                      {totals.discountPct != null && totals.discountPct > 0 && (
                        <Badge className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded">
                          {totals.discountPct}%
                        </Badge>
                      )}
                    </div>
                    <span className="font-medium text-red-600">
                      - ৳{Math.round(totals.variantPriceDiscount)}
                    </span>
                  </div>
                )}
                {totals.extraLineDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">Extra discount:</span>
                    <span className="font-medium text-red-600">
                      - ৳{Math.round(totals.extraLineDiscount)}
                    </span>
                  </div>
                )} */}
                {/* {totals.couponAllocated > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">
                      Coupon discount
                      {(orderData?.coupon_name as string) && (
                        <span className="text-gray-500 font-normal">
                          {' '}
                          ({String(orderData.coupon_name)})
                        </span>
                      )}
                      :
                    </span>
                    <span className="font-medium text-red-600">
                      - ৳{Math.round(totals.couponAllocated)}
                    </span>
                  </div>
                )} */}
                {totals.chinaCourier > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900">
                      China Local Courier Charge:
                    </span>
                    <span className="font-medium text-green-600">
                      + ৳{Math.round(totals.chinaCourier)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span>৳{totals.productPrice.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between font-semibold text-sm pt-2">
                  <span className="text-gray-900">Paid:</span>
                  <span className="font-medium text-red-600">
                    - ৳{Math.round(paidShare)}
                  </span>
                </div> */}
                {due > 0 && (
                  <div className="flex justify-between text-sm font-semibold pt-2">
                    <span className="text-gray-900">Due:</span>
                    <span>
                      ৳{Math.round(due)}{' '}
                      <span className="text-gray-500 font-normal">
                        + Shipping Charge
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
