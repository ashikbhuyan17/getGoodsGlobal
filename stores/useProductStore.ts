import { create } from "zustand";

export type VariantItem = {
  color_id: string;
  size: string;
  quantity: number;
  price: number;
};

type ShippingArea = { id: string | number; amount: number };

type ProductStore = {
  selectedColor: { id?: string | number; colorName?: string } | null;
  setSelectedColor: (c: ProductStore["selectedColor"]) => void;
  shippingArea: ShippingArea | null;
  setShippingArea: (a: ShippingArea | null) => void;
  variants: VariantItem[];
  setVariant: (colorId: string, size: string, quantity: number, price: number) => void;
  totalQuantity: () => number;
  priceList: () => { id: string; price: number; quantity: number }[];
  colorQty: (colorId: string) => number;
  shippingOptions: { id: string | number; name: string; amount: number }[];
  initFromProduct: (product: unknown, shippingOverride?: unknown[]) => void;
  reset: () => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  selectedColor: null,
  setSelectedColor: (c) => set({ selectedColor: c }),
  shippingArea: null,
  setShippingArea: (a) => set({ shippingArea: a }),
  variants: [],
  setVariant: (colorId, size, quantity, price) =>
    set((s) => {
      const cid = String(colorId);
      const sz = String(size);
      const rest = s.variants.filter(
        (v) => !(String(v.color_id) === cid && String(v.size) === sz)
      );
      if (quantity > 0) {
        return {
          variants: [...rest, { color_id: cid, size: sz, quantity, price }],
        };
      }
      return { variants: rest };
    }),
  totalQuantity: () => get().variants.reduce((sum, v) => sum + v.quantity, 0),
  priceList: () =>
    get().variants.map((v) => ({
      id: `${v.color_id}-${v.size}`,
      price: v.price,
      quantity: v.quantity,
    })),
  colorQty: (colorId: string) =>
    get().variants
      .filter((v) => String(v.color_id) === String(colorId))
      .reduce((sum, v) => sum + v.quantity, 0),
  shippingOptions: [],
  initFromProduct: (product, shippingOverride?: unknown[]) =>
    set((s) => {
      // API format: { product, shippingCharge, productColors } or normalized { data: {...} }
      const d = (product as { data?: unknown })?.data ?? product;
      const data = d as {
        shippingCharge?: unknown[];
        shippingcharge?: unknown[];
        productColors?: { color?: unknown }[];
      };
      const options = (data?.shippingCharge ?? data?.shippingcharge ?? shippingOverride ?? []) as { id?: unknown; name?: string; amount?: number }[];
      const list = Array.isArray(options)
        ? options.map((o) => ({
            id: (o?.id ?? 0) as string | number,
            name: String(o?.name ?? ""),
            amount: Number(o?.amount ?? 0),
          }))
        : [];
      const first = list[0];
      return {
        shippingOptions: list,
        shippingArea: first ? { id: first.id, amount: first.amount } : s.shippingArea,
        selectedColor: s.selectedColor ?? (data?.productColors?.[0]?.color as ProductStore["selectedColor"]) ?? null,
      };
    }),
  reset: () =>
    set({
      selectedColor: null,
      shippingArea: null,
      variants: [],
      shippingOptions: [],
    }),
}));
