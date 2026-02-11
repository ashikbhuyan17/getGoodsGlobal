"use client";

import { Button } from "../ui/button";
import { useProductStore } from "@/stores/useProductStore";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Input } from "../ui/input";

function SizeCard({
  size,
  price,
  colorId,
  max = 999999999,
}: {
  size: string;
  price: number;
  colorId: string;
  max?: number;
}) {
  const setVariant = useProductStore((s) => s.setVariant);
  const quantity =
    useProductStore(
      (s) =>
        s.variants.find(
          (v) => String(v.color_id) === String(colorId) && v.size === size
        )?.quantity
    ) ?? 0;

  const update = (val: number) => {
    const clamped = Math.max(0, Math.min(max, val));
    setVariant(String(colorId), size, clamped, price);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    update(isNaN(val) ? 0 : val);
  };

  return (
    <div className="grid grid-cols-3 gap-0 items-center py-3 px-1">
      <p className="text-left text-gray-800">{size}</p>
      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold text-gray-800">৳{price}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {quantity < 1 ? (
          <Button
            onClick={() => update(1)}
            className="text-white px-4 py-2 rounded-md"
          >
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              className="rounded-full w-5 h-5"
              size="icon"
              onClick={() => update(quantity - 1)}
              disabled={quantity <= 0}
            >
              <MinusIcon size={16} aria-hidden="true" />
            </Button>
            <Input
              type="number"
              className="w-12 px-0 text-center"
              value={quantity}
              min={0}
              max={max}
              onChange={onChange}
            />
            <Button
              className="rounded-full w-5 h-5"
              size="icon"
              onClick={() => update(quantity + 1)}
              disabled={quantity >= max}
            >
              <PlusIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SizeCard;
