"use client";

import { Badge } from "@/components/ui/badge";
import ImagePreview from "@/components/common/ImagePreview";

interface OrderProductDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderDetails: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderData?: any;
}

// Default product image
const DEFAULT_PRODUCT_IMAGE = "/placeholder-product.png";

export default function OrderProductDetails({ orderDetails, orderData }: OrderProductDetailsProps) {
  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
        <p className="text-sm text-gray-500">No products found</p>
      </div>
    );
  }

  // Group products by product_id or product_name
  const productGroups = orderDetails.reduce((acc: any, item: any) => {
    const key = item?.product_id || item?.product_name || "unknown";
    if (!acc[key]) {
      acc[key] = {
        product_id: item?.product_id,
        product_name: item?.product_name || "N/A",
        product_image: item?.product_image || item?.image || DEFAULT_PRODUCT_IMAGE,
        variants: [],
      };
    }
    acc[key].variants.push(item);
    return acc;
  }, {});

  const products = Object.values(productGroups);

  // Calculate totals for each product
  const calculateTotals = (variants: any[], allOrderDetails: any[], orderData: any) => {
    let productPrice = 0;
    let discount = 0;
    let chinaCourier = 0;

    variants.forEach((variant: any) => {
      const qty = Number(variant?.qty || 0);
      const price = Number(variant?.sale_price || variant?.price || 0);
      productPrice += qty * price;

      // Add discount if available
      if (variant?.product_discount || variant?.discount) {
        discount += Number(variant.product_discount || variant.discount);
      }

      // Add China courier charge if available
      if (variant?.china_courier_charge) {
        chinaCourier += Number(variant.china_courier_charge);
      }
    });

    const total = productPrice - discount + chinaCourier;

    // Calculate order-level totals for proportional distribution
    let orderTotal = 0;
    allOrderDetails.forEach((item: any) => {
      const qty = Number(item?.qty || 0);
      const price = Number(item?.sale_price || item?.price || 0);
      const itemTotal = qty * price;
      const itemDiscount = Number(item?.product_discount || item?.discount || 0);
      const itemCourier = Number(item?.china_courier_charge || 0);
      orderTotal += itemTotal - itemDiscount + itemCourier;
    });

    // Calculate paid and due proportionally
    const orderPaid = Number(orderData?.paid_partial_payment_amount || orderData?.paid_amount || orderData?.advance_payment || 0);
    const productShare = orderTotal > 0 ? total / orderTotal : 0;
    const paid = orderPaid * productShare;
    const due = total - paid;

    // Get discount percentage from first variant
    const discountPercentage = variants[0]?.discount_percentage ||
      (discount > 0 && productPrice > 0 ? Math.round((discount / productPrice) * 100) : null);

    return { productPrice, discount, chinaCourier, total, paid, due, discountPercentage };
  };

  return (
    <div className="space-y-6">
      {products.map((product: any, index: number) => {
        const totals = calculateTotals(product.variants, orderDetails, orderData || {});

        return (
          <div key={index} className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
            {/* Product Image and Title */}
            <div className="flex items-center gap-4 mb-4">
              <ImagePreview
                src={product.product_image || DEFAULT_PRODUCT_IMAGE}
                alt={product.product_name}
                width={64}
                height={64}
                className="shrink-0 rounded-lg overflow-hidden"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 leading-tight">
                  {product.product_name}
                </h4>
              </div>
            </div>
            <div className="border-t"></div>

            {/* Variants Table */}
            <div className="mb-4">

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr >
                      <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">Variant</th>
                      <th className="text-center py-2 px-3 text-sm font-semibold text-gray-700">Qty × Price</th>
                      <th className="text-right py-2 px-3 text-sm font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant: any, vIndex: number) => {
                      const variantImage = variant?.variant_image || variant?.product_image || product.product_image || DEFAULT_PRODUCT_IMAGE;
                      const variantPrice = Number(variant?.sale_price || variant?.price || 0);
                      const variantQty = Number(variant?.qty || 0);
                      const variantTotal = variantQty * variantPrice;
                      const variantColor = variant?.product_color || variant?.color || "N/A";
                      const variantSize = variant?.product_size || variant?.size || "N/A";

                      return (
                        <tr key={vIndex} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              {/* Variant Image with Preview */}
                              <div className="shrink-0">
                                <ImagePreview
                                  src={variantImage}
                                  alt={variantColor}
                                  width={50}
                                  height={50}
                                  className="rounded-full overflow-hidden"
                                />
                              </div>

                              {/* Color and Price below image */}
                              <div className="flex flex-col gap-1">
                                <div>
                                  <span className="text-xs text-gray-500">Color: </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {variantColor}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Size: </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {variantSize}
                                  </span>
                                </div>
                                {/* <div>
                                  <span className="text-xs text-gray-500">Price: </span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    ৳{variantPrice}
                                  </span>
                                </div> */}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {variantQty} × ৳{variantPrice}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              ৳{variantTotal.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Summary - Matching Image UI */}
            <div className="border-t pt-4 space-y-2">
              {/* Product Price */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-900">Product Price:</span>
                <span className="font-medium text-gray-900">৳{Math.round(totals.productPrice)}</span>
              </div>

              {/* Ramadan Offer */}
              {totals.discount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">Ramadan Offer:</span>
                    {totals.discountPercentage && (
                      <Badge className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded">
                        {totals.discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium text-red-600">- ৳{Math.round(totals.discount)}</span>
                </div>
              )}

              {/* China Local Courier Charge */}
              {totals.chinaCourier > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">China Local Courier Charge:</span>
                  <span className="font-medium text-green-600">+ ৳{Math.round(totals.chinaCourier)}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center text-sm font-semibold pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">৳{Math.round(totals.total)}</span>
              </div>

              {/* Paid */}
              {totals.paid > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">Paid:</span>
                  <span className="font-medium text-red-600">- ৳{Math.round(totals.paid)}</span>
                </div>
              )}

              {/* Due */}
              {totals.due > 0 && (
                <div className="flex justify-between items-center text-sm font-semibold pt-2">
                  <span className="text-gray-900">Due:</span>
                  <span className="text-gray-900">
                    <span>৳{Math.round(totals.due)}</span>
                    <span className="text-gray-500 font-normal"> + Shipping Charge</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
