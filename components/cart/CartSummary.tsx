"use client";

import { useState, useEffect } from "react";
import PriceRow from "./PriceRow";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartSummary({
  page = "cart",
  total,
  formData,
}: {
  page?: "cart" | "checkout";
  total: number;
  formData?: {
    name: string;
    phone: string;
    address: string;
    customer_id: number;
    payment_method: string;
  };
}) {
  const router = useRouter();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState<null | {
    discount: number;
    type: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState(total);

  useEffect(() => {
    if (!discount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinalPrice(total);
      return;
    }

    if (discount.type === "Solid") {
      setFinalPrice(discount.discount);
    } else if (discount.type === "Percentage") {
      const discountAmount = (total * discount.discount) / 100;
      setFinalPrice(total - discountAmount);
    }
  }, [discount, total]);

  const validateForm = () => {
    if (page !== "checkout") return true;

    if (!formData?.name) return toast.error("Name is required"), false;
    if (!formData?.phone) return toast.error("Phone number is required"), false;

    if (!/^\d{11}$/.test(formData.phone))
      return toast.error("Phone must be 11 digits"), false;

    if (!formData?.address) return toast.error("Address is required"), false;

    if (!formData?.customer_id || formData.customer_id <= 0)
      return toast.error("Invalid customer ID"), false;

    if (!formData?.payment_method)
      return toast.error("Please select a payment method"), false;

    return true;
  };


  const handleCouponVerify = async () => {
    if (!coupon.trim()) {
      toast.error("Enter a coupon code first");
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
        toast.success("Coupon applied!");
      } else {
        setDiscount(null);
        toast.error("Invalid or expired coupon");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify coupon");
    }

    setLoading(false);
  };

  const handleOrder = async () => {
    if (page !== "checkout") return;

    if (!validateForm()) return;

    toast.loading("Placing your order...");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderData: any = await fetcher("/order-place", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          coupon_name: coupon,
          discount,
        }),
      });

      toast.dismiss();

      if (orderData?.status === "success") {
        toast.success("Order placed successfully!");
        router.push("/account/orders");
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (err) {
      console.log(err);

      toast.dismiss();
      toast.error("Failed to place order. Try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold">Cart Summary</h2>

      {/* Coupon Section */}
      {page === "checkout" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Apply Coupon</label>

          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon"
              className="border rounded-md px-3 py-2 w-full"
            />
            <Button
              onClick={handleCouponVerify}
              disabled={loading}
              className="bg-primary hover:bg-primary/95"
            >
              {loading ? "Checking..." : "Verify"}
            </Button>
          </div>

          {discount && page === "checkout" && (
            <p className="text-green-600 text-sm">
              Coupon applied! Discount: ৳{total - finalPrice}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <PriceRow label="Product price" value={`৳${total}`} />

        {discount && page === "checkout" && (
          <PriceRow label="Discount" value={`-৳${total - finalPrice}`} />
        )}

        {discount && page === "checkout" && (
          <div className="border-t pt-4">
            <PriceRow label="Final price" value={`৳${finalPrice}`} />
          </div>
        )}
      </div>

      <div className="border-2 border-dashed border-primary rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">Pay on delivery</p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            ৳{Number(finalPrice).toFixed()} + Shipping & Courier Charges
          </span>

          <InfoIcon size={16} className="text-gray-400" />
        </div>
      </div>

      {page === "checkout" ? (
        <Button
          onClick={handleOrder}
          className="w-full bg-primary hover:bg-primary/95 py-6 text-base"
        >
          Place Order & Pay
        </Button>
      ) : (
        <Link prefetch href={"/checkout"}>
          <Button className="w-full bg-primary hover:bg-primary/95 py-6 text-base">
            Go to Checkout
          </Button>
        </Link>
      )}
    </div>
  );
}
