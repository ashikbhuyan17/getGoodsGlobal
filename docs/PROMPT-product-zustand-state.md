# Full Prompt: Product Page Zustand State Management

**Branch name:** `feat/product-zustand-state-management`

---

## Task Overview

Refactor the product page to use Zustand for state management. Remove all API calls from SizeCard. Centralize product state in a single store. API calls only from ActionButtons (Add to Cart, Buy Now, Wishlist).

---

## Architecture Summary

| Component | Before | After |
|-----------|--------|-------|
| SizeCard | get-qty API, product-add-to-cart API | No API — only updates Zustand store via `setVariant()` |
| ActionButtons | Navigate only | POST add-to-cart, buy-now (both APIs on Buy Now), wishlist |
| ProductDetails | Props drilling | Reads from Zustand store |
| ProductSummary | Fetch shipping area | Uses `shippingOptions` from store (from product init) |
| ProductPageClient | — | `initFromProduct()` on mount, `reset()` on unmount |

---

## Step 1: Install Zustand

```bash
yarn add zustand
```

---

## Step 2: Create Zustand Store

Create `stores/useProductStore.ts`:

```typescript
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
  initFromProduct: (product: unknown) => void;
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
  initFromProduct: (product) =>
    set((s) => {
      const data = (product as { data?: unknown })?.data ?? product;
      const d = data as {
        shippingCharge?: unknown[];
        shippingcharge?: unknown[];
        productColors?: { color?: unknown }[];
      };
      const options = d?.shippingCharge ?? d?.shippingcharge ?? [];
      const list = Array.isArray(options)
        ? options.map((o: { id?: unknown; name?: string; amount?: number }) => ({
            id: o?.id ?? 0,
            name: String(o?.name ?? ""),
            amount: Number(o?.amount ?? 0),
          }))
        : [];
      const first = list[0];
      return {
        shippingOptions: list,
        shippingArea: first ? { id: first.id, amount: first.amount } : s.shippingArea,
        selectedColor: s.selectedColor ?? d?.productColors?.[0]?.color ?? null,
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
```

---

## Step 3: SizeCard — No API, Only Store Updates

- Remove `get-qty` API call
- Remove `product-add-to-cart` API call
- Read quantity from `useProductStore` → `variants.find(...)`
- Add / +/- / input change → call `setVariant(colorId, size, quantity, price)`
- Props: `colorId`, `size`, `price`, `max` (optional)

---

## Step 4: ActionButtons — API Calls

### Add to Cart

- Check auth via `/user-profile`; redirect to `/signin` if not logged in
- Validate `totalQuantity >= 1`; show MinOrderModal if invalid
- Build `cart_details` from `variants.filter(v => v.quantity > 0).map(v => ({ color_id, size, quantity }))`
- POST to `/product-add-to-cart`:

```json
{
  "product_id": "49",
  "shippingcharge_id": "1",
  "total_quantity": "52",
  "cart_details": [
    { "color_id": "99", "size": "100gm", "quantity": "50" }
  ]
}
```

- Success: toast, navigate to `/cart`

### Buy Now

- Same auth + validation as Add to Cart
- **Hit both APIs in order:**
  1. POST `/product-add-to-cart` with `cart_details`
  2. POST `/product-buy-now` with `buy_details` (same structure as cart_details)
- Success: toast, navigate to `/checkout?buyNow=1`

```json
{
  "product_id": "49",
  "shippingcharge_id": "1",
  "total_quantity": "52",
  "buy_details": [
    { "color_id": "99", "size": "100gm", "quantity": "50" }
  ]
}
```

### MinOrderModal

- Show when `totalQuantity < 1` or no shipping area
- Message: "Minimum Order Quantity 1" / "সর্বনিম্ন 1 টি পণ্য অর্ডার করতে হবে"

---

## Step 5: ProductDetails

- Use `useProductStore` for: `selectedColor`, `setSelectedColor`, `variants`, `colorQty`
- Color badge shows `colorQty(colorId)` from store
- SizeCard receives: `colorId`, `size`, `price`, `max`
- No quantity/callback props to SizeCard

---

## Step 6: ProductSummary

- No client-side `/shipping-area` fetch
- Use `shippingOptions` from store
- Shipping area from `initFromProduct` (product response has `shippingCharge` / `shippingcharge`)
- Pass `productId`, `isInWishlist`, `bulkQuantities` to ActionButtons

---

## Step 7: ProductPageClient

- On mount: `initFromProduct(product)` when product is available
- On unmount: `reset()`
- Pass `product`, `bulkQuantities`, `isInWishlist` to children

---

## Step 8: Checkout

- Cart flow: `/cart` → `/checkout` → uses `cart-products`
- Buy Now flow: `/checkout?buyNow=1` → uses `buy-products`
- CheckoutClient normalizes `cartdetails` and `buydetails` from API responses

---

## Files Changed

| File | Change |
|------|--------|
| `stores/useProductStore.ts` | New — Zustand store |
| `components/product/SizeCard.tsx` | Remove APIs, use store |
| `components/product/ActionButtons.tsx` | Add API calls (add-to-cart, buy-now both on Buy Now) |
| `components/product/ProductDetails.tsx` | Read from store, minimal props |
| `components/product/ProductSummary.tsx` | Use store shippingOptions |
| `components/product/ProductPageClient.tsx` | initFromProduct + reset |
| `components/product/MinOrderModal.tsx` | Existing — used for min order validation |

---

## API Endpoints

- `POST /product-add-to-cart` — payload: `product_id`, `shippingcharge_id`, `total_quantity`, `cart_details`
- `POST /product-buy-now` — payload: `product_id`, `shippingcharge_id`, `total_quantity`, `buy_details`
- `cart_details` / `buy_details`: `[{ color_id, size, quantity }]` (strings)

---

## Important Notes

1. **No client-side GET** for product details or shipping — init from server product
2. **SizeCard** never calls API — only `setVariant()`
3. **Buy Now** = add-to-cart API + buy-now API (both hit)
4. **Zustand** holds all product page state — no prop drilling for quantity/variants



Product page এ full Zustand state management implement করো। 

Branch: feat/product-zustand-state-management

Requirements:
1. Zustand store তৈরি করো (stores/useProductStore.ts) — variants, selectedColor, shippingArea, shippingOptions, setVariant, totalQuantity, colorQty, initFromProduct, reset
2. SizeCard — কোনো API call না, শুধু setVariant() দিয়ে store update
3. ActionButtons — Add to Cart: POST /product-add-to-cart (cart_details). Buy Now: প্রথমে /product-add-to-cart, তারপর /product-buy-now (buy_details) — দুটো API hit
4. ProductDetails, ProductSummary — store থেকে read
5. ProductPageClient — mount এ initFromProduct, unmount এ reset

Full spec: docs/PROMPT-product-zustand-state.md