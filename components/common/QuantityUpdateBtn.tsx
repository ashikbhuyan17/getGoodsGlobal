/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QuantityUpdateBtn({
  quantity,
  setQuantity,
  setSizes,
  size,
  id,
  max = 9999,
  min = 0,
  setPrice,
  handleAddToCart,
}: {
  quantity: number;
  id?: number | string;
  setQuantity: any;
  setPrice?: any;
  setSizes?: any;
  size: string | number;
  max?: number;
  min?: number;
  handleAddToCart?: (qty: number) => void;
}) {
  const updateAll = (newVal: number) => {
    // clamp within range
    const val = Math.max(min, Math.min(max, newVal));

    setQuantity(val);

    if (handleAddToCart) {
      handleAddToCart(val);
    }

    if (setSizes) {
      setSizes((prev: any) => ({ ...prev, [size]: val }));
    }

    if (setPrice) {
      setPrice((prev: any) =>
        prev?.map((item: any) =>
          item?.id === id ? { ...item, quantity: val } : item
        )
      );
    }
  };

  const decrease = () => updateAll(quantity - 1);
  const increase = () => updateAll(quantity + 1);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);

    // if NaN, set to min
    if (isNaN(val)) {
      updateAll(min);
      return;
    }

    updateAll(val);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        className="rounded-full w-5 h-5"
        size="icon"
        onClick={decrease}
        disabled={quantity <= min}
      >
        <MinusIcon size={16} aria-hidden="true" />
      </Button>

      <Input
        type="number"
        className="w-12 px-0 text-center"
        value={quantity}
        min={min}
        max={max}
        onChange={onChange}
      />

      <Button
        className="rounded-full w-5 h-5"
        size="icon"
        onClick={increase}
        disabled={quantity >= max}
      >
        <PlusIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
