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
    <div className="grid grid-cols-3 items-center border-b py-2">
      <p>{size}</p>
      <p>৳{price}</p>

      {quantity < 1 ? (
        <Button
          onClick={() => {
            setQuantity(1);
            handleAddToCart(1);
          }}
          className="w-20"
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
    </div>
  );
}

export default SizeCard;
