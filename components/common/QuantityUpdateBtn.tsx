/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
  /**
   * While the input is focused, keep a string draft so the user can clear the
   * field and type a new quantity (e.g. 0 → 5) without the controlled value
   * snapping back each keystroke.
   */
  const [draft, setDraft] = useState<string | null>(null);

  const displayValue = draft !== null ? draft : String(quantity);

  const updateAll = (newVal: number) => {
    const val = Math.max(min, Math.min(max, newVal));
    setDraft(null);
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
          item?.id === id ? { ...item, quantity: val } : item,
        ),
      );
    }
  };

  const effectiveQuantity = () => {
    if (draft !== null && draft !== '') {
      const n = parseInt(draft, 10);
      if (!Number.isNaN(n)) return Math.max(min, Math.min(max, n));
    }
    return quantity;
  };

  const decrease = () => updateAll(effectiveQuantity() - 1);
  const increase = () => updateAll(effectiveQuantity() + 1);

  const commitInput = (raw: string) => {
    if (raw === '') {
      updateAll(min);
      return;
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) {
      setDraft(null);
      return;
    }
    updateAll(n);
  };

  return (
    <div
      className={cn(
        'flex w-full min-w-0 max-w-full items-center justify-center gap-0.5 rounded-full border border-gray-200 bg-gray-50/90 p-0.5 pl-0.5 shadow-sm sm:inline-flex sm:w-auto sm:max-w-none sm:gap-1 sm:pl-1',
      )}
      role="group"
      aria-label="Quantity"
    >
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="h-7 w-7 shrink-0 rounded-full border-0 bg-white shadow-sm hover:bg-gray-100 sm:h-8 sm:w-8"
        onClick={decrease}
        disabled={effectiveQuantity() <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-3.5 sm:size-4" aria-hidden />
      </Button>

      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className="h-7 min-w-0 max-w-11 flex-1 border-0 bg-transparent px-0.5 text-center text-xs font-medium tabular-nums focus-visible:ring-1 focus-visible:ring-teal-500 sm:h-8 sm:max-w-12 sm:flex-none sm:px-1 sm:text-sm"
        value={displayValue}
        aria-label="Quantity value"
        onFocus={() => setDraft(String(quantity))}
        onChange={(e) => {
          const next = e.target.value;
          if (next === '') {
            setDraft('');
            return;
          }
          if (!/^\d*$/.test(next)) {
            return;
          }
          const n = parseInt(next, 10);
          if (Number.isNaN(n)) {
            setDraft(next);
            return;
          }
          if (n > max) {
            updateAll(max);
            return;
          }
          setDraft(next);
        }}
        onBlur={() => {
          if (draft === null) return;
          const raw = draft;
          setDraft(null);
          commitInput(raw);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="h-7 w-7 shrink-0 rounded-full border-0 bg-white shadow-sm hover:bg-gray-100 sm:h-8 sm:w-8"
        onClick={increase}
        disabled={effectiveQuantity() >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-3.5 sm:size-4" aria-hidden />
      </Button>
    </div>
  );
}
