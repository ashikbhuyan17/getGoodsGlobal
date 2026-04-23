interface OrderPaymentsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payment: any;
}

type VariantRow = {
  qty?: string | number;
  sale_price?: string | number;
  price?: string | number;
  product_price?: string | number;
};

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Per variant: line total from `product_price` when present, else qty × sale. */
function sumQtyAndProductSubtotal(products: unknown[] | undefined): {
  totalQty: number;
  productSubtotal: number;
} {
  let totalQty = 0;
  let productSubtotal = 0;
  if (!Array.isArray(products)) return { totalQty: 0, productSubtotal: 0 };

  for (const p of products) {
    const variants = (p as { variants?: unknown[] })?.variants;
    if (!Array.isArray(variants)) continue;
    for (const raw of variants) {
      if (raw == null || typeof raw === 'string') continue;
      const v = raw as VariantRow;
      const q = num(v.qty, 0);
      totalQty += q;
      const hasLine = v.product_price != null && v.product_price !== '';
      if (hasLine) {
        productSubtotal += num(v.product_price);
      } else {
        const unit = num(v.sale_price ?? v.price, 0);
        productSubtotal += unit * q;
      }
    }
  }
  return { totalQty, productSubtotal };
}

function formatMoney(n: number): string {
  const v = num(n);
  if (Number.isInteger(v)) return v.toLocaleString('en-BD');
  return v.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function OrderPaymentsCard({ payment }: OrderPaymentsCardProps) {
  const products = payment?.products as unknown[] | undefined;
  const { totalQty, productSubtotal } = sumQtyAndProductSubtotal(products);

  /** Order-level: only `coupon_discount` is shown in "Coupon Discount" (not `discount`). */
  const couponOnly = num(payment?.coupon_discount, 0);
  const flashDiscount = num(payment?.flash_sale_discount_amount, 0);

  const shipping = num(payment?.shipping_charge, 0);
  const codCharge = num(payment?.cod_charge, 0);
  const paid = num(
    payment?.paid_amount ?? payment?.paid_partial_payment_amount,
    0,
  );

  /**
   * pre-COD subtotal: items + ship − order discounts (equals Sub-Total in the reference layout).
   * When variants are missing or not parsed, infer from due + paid − cod so the card matches the API.
   */
  const hasLineItems = totalQty > 0 || productSubtotal > 0;
  const preCodFromApi =
    payment?.payment_due_amount != null
      ? num(payment.payment_due_amount) - codCharge + paid
      : null;

  /** Product Price row: prefer API `amount`; otherwise sum variants or infer from due. */
  const hasAmount =
    payment?.amount != null && String(payment.amount).trim() !== '';
  const productBase = hasAmount
    ? num(payment.amount)
    : hasLineItems
      ? productSubtotal
      : preCodFromApi != null
        ? preCodFromApi - shipping + couponOnly + flashDiscount
        : productSubtotal;

  const subTotal = productBase - couponOnly - flashDiscount + shipping;

  const dueRaw =
    payment?.payment_due_amount != null
      ? num(payment.payment_due_amount)
      : subTotal + codCharge - paid;

  // const formatDate = (dateString: string) => {
  //   if (!dateString) return 'N/A';
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleString('en-GB', {
  //       day: '2-digit',
  //       month: '2-digit',
  //       year: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: true,
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-12 border-b last:border-b-0">
      <div className="col-span-4 md:col-span-5 bg-gray-50 px-4 py-3 text-sm text-gray-600 font-medium">
        {label}
      </div>
      <div className="col-span-8 md:col-span-7 px-4 py-3 text-sm text-gray-900">
        {value ?? 'N/A'}
      </div>
    </div>
  );

  const couponDiscountDisplay =
    couponOnly > 0 ? `−৳${formatMoney(couponOnly)}` : `৳${formatMoney(0)}`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold text-gray-900">Payments</h3>
      </div>

      {/* <div className="divide-y">
        <Row
          label="Method"
          value={
            <Badge className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
              {payment?.payment_method ||
                payment?.order_type ||
                payment?.method ||
                'N/A'}
            </Badge>
          }
        />
        <Row
          label="Date"
          value={formatDate(
            payment?.created_at || payment?.date || payment?.payment_date,
          )}
        />
      </div> */}

      <div className="divide-y border-t">
        <Row label="Quantity" value={String(totalQty || '0')} />
        <Row label="Product Price" value={`৳${formatMoney(productBase)}`} />
        <Row label="Coupon Discount" value={couponDiscountDisplay} />
        {flashDiscount > 0 && (
          <Row
            label="Flash Sale Discount"
            value={`−৳${formatMoney(flashDiscount)}`}
          />
        )}
        <Row label="Shipping Charge" value={`৳${formatMoney(shipping)}`} />
        {/* <Row
          label="Sub-Total"
          value={
            <span className="font-semibold">৳{formatMoney(subTotal)}</span>
          }
        /> */}
      </div>

      <div className="h-3 bg-white border-t" aria-hidden />

      <div className="divide-y">
        <Row label="COD/MFS Charge" value={`৳${formatMoney(codCharge)}`} />
        <Row label="Paid" value={`৳${formatMoney(paid)}`} />
        <Row
          label="Due"
          value={<span className="font-semibold">৳{formatMoney(dueRaw)}</span>}
        />
      </div>

      {(payment?.bkash_tranxId ||
        payment?.transaction_id ||
        payment?.trx_id) && (
          <div className="divide-y border-t">
            <Row
              label="Trx ID"
              value={
                <span className="font-mono">
                  {payment?.bkash_tranxId ||
                    payment?.transaction_id ||
                    payment?.trx_id}
                </span>
              }
            />
          </div>
        )}
    </div>
  );
}
