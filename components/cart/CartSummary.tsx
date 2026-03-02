/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import PriceRow from './PriceRow';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { InfoIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TermsModal from '@/components/checkout/TermsModal';

export default function CartSummary({
  page = 'cart',
  total,
  formData,
  allDeselected,
  onCheckoutClick,
  isCheckoutLoading = false,
  cartIds,
  isBuyNow = false,
  shippingCharge = 0,
  shippingChargeID,
  requiresShippingSelection = false,
}: {
  page?: 'cart' | 'checkout';
  total: number;
  formData?: {
    name: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    customer_id: number;
    payment_method: string;
    shipping_method_id?: number;
    shipping_method_name?: string;
    shipping_amount?: number;
  };
  allDeselected?: boolean;
  onCheckoutClick?: () => void;
  isCheckoutLoading?: boolean;
  /** Cart IDs to send with order-place (checkout from cart). */
  cartIds?: number[];
  /** When true, call buy-order-place instead of order-place. */
  isBuyNow?: boolean;
  /** Shipping charge from selected method (checkout page only). */
  shippingCharge?: number;
  shippingChargeID?: number;
  /** When true, user must select a shipping method (checkout with shipping options). */
  requiresShippingSelection?: boolean;
}) {
  const router = useRouter();

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState<null | {
    discount: number;
    type: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const discountAmount = (() => {
    if (!discount) return 0;
    const val = Number(discount.discount) || 0;
    if (discount.type === 'Solid') return Math.min(val, total);
    if (discount.type === 'Percentage') return (total * val) / 100;
    return 0;
  })();
  const subtotalAfterDiscount = total - discountAmount;
  const finalPrice = subtotalAfterDiscount + shippingCharge;

  const validateForm = () => {
    if (page !== 'checkout') return true;

    if (!formData?.name || formData.name.trim() === '') {
      toast.error('Name is required');
      return false;
    }

    if (!formData?.phone || formData.phone.trim() === '') {
      toast.error('Phone number is required');
      return false;
    }

    if (!/^\d{11}$/.test(formData.phone)) {
      toast.error('Phone must be 11 digits');
      return false;
    }

    if (!formData?.district || formData.district.trim() === '') {
      toast.error('District is required');
      return false;
    }

    if (!formData?.city || formData.city.trim() === '') {
      toast.error('City is required');
      return false;
    }

    if (!formData?.address || formData.address.trim() === '') {
      toast.error('Address is required');
      return false;
    }

    if (!formData?.customer_id || formData.customer_id <= 0) {
      toast.error('Invalid customer ID');
      return false;
    }

    if (!formData?.payment_method) {
      toast.error('Please select a payment method');
      return false;
    }

    if (requiresShippingSelection && (!shippingCharge || shippingCharge <= 0)) {
      toast.error('Please select a shipping method');
      return false;
    }

    return true;
  };

  const handleCouponVerify = async () => {
    if (!coupon.trim()) {
      toast.error('Enter a coupon code first');
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await fetcher(`/apply/coupon?coupon_name=${coupon}`);

      if (res?.success === true) {
        setDiscount({
          discount: res.discount,
          type: res.type,
        });
        toast.success('Coupon applied!');
      } else {
        setDiscount(null);
        toast.error('Invalid or expired coupon');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to verify coupon');
    }

    setLoading(false);
  };

  const handlePlaceOrderClick = () => {
    if (page !== 'checkout') return;
    if (!validateForm()) return;
    setShowTermsModal(true);
  };

  const handleAcceptTerms = async () => {
    setShowTermsModal(false);

    toast.loading('Placing your order...');

    try {
      const orderPayload = {
        ...formData,
        total_price: finalPrice,
        shippingfee: shippingCharge,
        shippingcharge_id: shippingChargeID,
        coupon_code: discount ? coupon : null,
        ...(!isBuyNow && cartIds?.length ? { cart_ids: cartIds } : {}),
      };
      const endpoint = isBuyNow ? '/buy-order-place' : '/order-place';
      const orderData: any = await fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      toast.dismiss();

      if (orderData?.status === 'success') {
        toast.success('Order placed successfully!');
        const invoiceId = orderData?.invoice_id;
        router.push(`/payment/${invoiceId}`);
      } else {
        toast.error(orderData?.message ?? 'Failed to place order. Try again.');
      }
    } catch (err) {
      console.log(err);

      toast.dismiss();
      toast.error('Failed to place order. Try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg max-md:mb-12">
      <h2 className="text-base font-bold text-center p-2 lg:p-4">
        Cart Summary
      </h2>
      <p className="border-t border-gray-200"></p>

      <div className="p-2 lg:p-6 space-y-2">
        <div className="space-y-4">
          <PriceRow label="Product price" value={`৳${total}`} />
          {page === 'checkout' && (
            <PriceRow label="Shipping" value={`৳${shippingCharge}`} />
          )}
          <PriceRow
            label="Total"
            value={`৳${page === 'checkout' ? total + shippingCharge : total}`}
          />
          {/* <PriceRow label="Pay now" value={`৳${total / 2}`} discount={50} /> */}

          {discount && page === 'checkout' && (
            <PriceRow label="Discount" value={`-৳${discountAmount}`} />
          )}

          {discount && page === 'checkout' && (
            <div className="border-t pt-4">
              <PriceRow label="Final price" value={`৳${finalPrice}`} />
            </div>
          )}
        </div>
        {/* Coupon Section */}
        {page === 'checkout' && (
          <div className="space-y-2">
            {/* <label className="text-sm font-semibold">Apply Coupon</label> */}

            <div className="flex">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon Code"
                className="border-y border-r-0 border-l rounded-md px-3 py-2 w-full"
              />
              <Button
                onClick={handleCouponVerify}
                disabled={loading}
                size="lg"
                className="bg-primary hover:bg-primary/95 -ml-2.5"
              >
                {loading ? 'Checking...' : 'Apply'}
              </Button>
            </div>

            {discount && page === 'checkout' && (
              <p className="text-green-600 text-sm">
                Coupon applied! Discount: ৳{discountAmount}
              </p>
            )}
          </div>
        )}

        {/* <div className="border border-dashed text-center border-primary bg-[#E3F5F9] rounded-lg p-4">
          <p className="font-medium">Pay on delivery</p>

          <div className="flex items-center font-medium justify-center gap-2">
            <span>
              ৳ {Number(finalPrice).toFixed()} + Shipping & Courier Charges
            </span>

            <InfoIcon size={16} />
          </div>
        </div> */}

        {
          page === 'checkout' ? (
            <>
              <Button
                onClick={handlePlaceOrderClick}
                className="w-full bg-primary hover:bg-primary/95 py-6 text-base"
              >
                Place Order & Pay
              </Button>
              <TermsModal
                open={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onAccept={handleAcceptTerms}
              />
            </>
          ) : (
            <Button
              onClick={onCheckoutClick}
              disabled={isCheckoutLoading}
              className="w-full bg-primary hover:bg-primary/95 py-6 text-base"
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Go to Checkout'
              )}
            </Button>
          )

          // onCheckoutClick ? (
          //   <Button
          //     onClick={onCheckoutClick}
          //     disabled={isCheckoutLoading}
          //     className="w-full bg-primary hover:bg-primary/95 py-6 text-base"
          //   >
          //     {isCheckoutLoading ? (
          //       <>
          //         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          //         Please wait...
          //       </>
          //     ) : (
          //       'Go to Checkout'
          //     )}
          //   </Button>
          // ) : (
          //   <Link prefetch href={'/checkout'}>
          //     <Button className="w-full bg-primary hover:bg-primary/95 py-6 text-base">
          //       Go to Checkout
          //     </Button>
          //   </Link>
          // )
        }
      </div>
    </div>
  );
}
