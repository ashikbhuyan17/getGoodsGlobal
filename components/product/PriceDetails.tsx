import { getActiveBulkTier, formatPriceInt } from '@/lib/utils';

export default function PriceDetails({
  quantity,
  price,
  shipping,
  bulkQuantities,
  flashSalePercentage,
}: {
  quantity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  price: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bulkQuantities?: any;
  shipping: number;
  flashSalePercentage?: string;
}) {
  const bulkTier = bulkQuantities ? getActiveBulkTier(bulkQuantities, quantity) : null;
  const pct = Number(flashSalePercentage) || 0;
  let productPrice = bulkTier
    ? bulkTier.price * quantity
    : (price?.reduce(
        (total: number, item: { price: number; quantity: number }) =>
          Number(total) + Number(item.price) * Number(item.quantity),
        0
      ) ?? 0);
  // When bulkQuantities, variant prices are bypassed - apply flash sale here. When no bulk, priceList already has discounted prices.
  if (bulkTier && pct > 0) {
    productPrice = productPrice * (1 - pct / 100);
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 my-4">
      <div className="flex justify-between py-1">
        <p>Quantity</p>
        <p>{quantity}</p>
      </div>
      <div className="flex justify-between py-1">
        <p>Product price</p>
        <p>৳{formatPriceInt(productPrice)}</p>
      </div>
      <div className="flex justify-between py-1">
        <p>Subtotal</p>
        <p>৳{formatPriceInt(productPrice)}</p>
      </div>
      {productPrice > 0 && (
        <div className="flex justify-between py-1">
          <p>Total</p>
          <p>৳{formatPriceInt(Number(productPrice) + Number(shipping))}</p>
        </div>
      )}
    </div>
  );
}
