/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import QuantityUpdateBtn from "../common/QuantityUpdateBtn";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { revalidateClient } from "@/action/revalidateClient";

function SizeCard({
  size,
  id,
  price,
  setSizes,
  max = 999999999,
  setPrice,
  colorId,
  productId,
  shippingchargeId,
}: {
  size: string | number;
  price: string | number;
  setSizes: any;
  id: number | string;
  max?: number;
  setPrice: any;
  productId: string;
  colorId: string;
  shippingchargeId: string;
}) {
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res: any = await fetcher(
        `/get-qty?product_id=${productId}&color_id=${colorId}&size=${size}`
      );

      const qty = Number(res?.data?.[0]?.quantity || 0);
      setQuantity(qty);
    })();
  }, [productId, colorId, size]);

  useEffect(() => {
    // Update sizes
    setSizes((prev: any) => {
      if (quantity < 1) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [size]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [size]: quantity };
    });

    // Update price
    setPrice((prev: any[]) => {
      const filtered = prev.filter((item) => item.id !== id);

      if (quantity < 1) return filtered;

      return [
        ...filtered,
        {
          id,
          price: Number(price),
          quantity,
        },
      ];
    });
  }, [quantity, size, id, price, setSizes, setPrice]);

  const handleAddToCart = async (qty: number) => {
    const user: any = await fetcher("/user-profile");
    if (!user?.data?.id) {
      router.push("/signin");
    } else {
      await fetcher("/product-add-to-cart", {
        method: "POSt",
        body: JSON.stringify({
          product_id: productId,
          shippingcharge_id: shippingchargeId,
          cart_details: [
            {
              color_id: colorId,
              size,
              quantity: qty,
            },
          ],
        }),
      });
      revalidateClient("/", "layout");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-0 items-center py-3 px-4">
      {/* Size Column */}
      <p className="text-left text-gray-800">{size}</p>

      {/* Price Column */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-semibold text-gray-800">৳{price}</p>
      </div>

      {/* Quantity Column */}
      <div className="flex flex-col items-end gap-1">
        {quantity < 1 ? (
          <Button
            onClick={() => {
              setQuantity(1);
              handleAddToCart(1);
            }}
            className=" text-white px-4 py-2 rounded-md"
          >
            Add
          </Button>
        ) : (
          <QuantityUpdateBtn
            handleAddToCart={handleAddToCart}
            id={id}
            setSizes={setSizes}
            size={size}
            quantity={quantity}
            setQuantity={setQuantity}
            max={max}
            setPrice={setPrice}
          />
        )}
        {/* <p className="text-sm text-gray-800">{max}</p> */}
      </div>
    </div>
  );
}

export default SizeCard;
