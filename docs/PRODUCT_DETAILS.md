# Product Details - সম্পূর্ণ ডকুমেন্টেশন

---

## ১. Bulk Quantities (মূল অংশ)

**কি:** নির্দিষ্ট quantity এর উপর ভিত্তি করে ভিন্ন ভিন্ন price tier। বেশি কিনলে কম দাম।

**কখন লোড:** `product.order_by == 1` হলে `GET /product-bulkquantities/${productId}` কল হয়।

**ডেটা উদাহরণ:**
```
1-99 পিস    → ৳550
100-199 পিস → ৳500
200+ পিস    → ৳450
```

**কিভাবে কাজ করে:** `getActiveBulkTier(bulkQuantities, totalQuantity)` – user যত quantity সিলেক্ট করেছে, সেই range এর tier এর price দেয়। যেমন 150 পিস সিলেক্ট করলে 100-199 tier এর ৳500 apply হবে।

**bulkQuantities থাকলে:** সব জায়গায় bulk tier price use। SizeCard এ `getActiveBulkTier().price`, PriceDetails এ `productPrice = bulkTier.price × quantity`। variant (size) price ignore।

**bulkQuantities না থাকলে:** সাধারণ variant price (`size?.SalePrice`) use।

---

## ২. Specification

**কি:** কিছু product এ Color/Size এর বদলে Specification থাকে (যেমন "36 colors pearlescent powder: 20ml")।

**hasSpecification:** `productColor.specification` null না হলে true। তখন UI তে "Color" ও "Size" এর জায়গায় "Specification" দেখায়। মান হিসেবে specification value দেখায়।

**গুরুত্বপূর্ণ:** API/cart এ সবসময় `sizeName` পাঠাতে হবে, specification নয়। UI তে specification দেখালেও backend কে sizeName দিতে হবে।

---

## ৩. Flash Sale

**কি:** পারসেন্টেজ ভিত্তিক discount (যেমন 5% off)।

**Calculation:** `basePrice × (1 - percentage/100)`। দশমিক রাখা, Math.round নাই। উদাহরণ: 450 - 5% = 427.5।

**কোথায় apply:** bulkQuantities থাকলে bulk price এর উপর, না থাকলে variant price এর উপর।

---

## ProductPage (page.tsx)

```
ProductPage (page.tsx)
  ├── fetcher('/product-details/${slug}')     → product data
  ├── fetcher('/wishlists')                   → wishlist check
  ├── fetcher('/shipping-area')               → shipping options
  └── p?.order_by == 1 হলে fetcher('/product-bulkquantities/${id}')  → bulk tiers
```

---

## ক্লায়েন্ট ইনিশিয়ালাইজেশন

```
ProductPageClient
  └── useEffect → initFromProduct(product, shippingOptions)
       └── useProductStore: shippingOptions, selectedColor সেট
```

---

## ভ্যারিয়েন্ট সিলেকশন

```
User Color সিলেক্ট করলে → setSelectedColor(color)
User Size row এ Add/Quantity change করলে → setVariant(colorId, size, qty, price)
```

---

## মূল কম্পোনেন্ট বিস্তারিত

**SizeCard Price:** bulkQuantities থাকলে `getActiveBulkTier().price`, না থাকলে `size?.SalePrice`। Flash sale থাকলে `basePrice × (1 - pct/100)`।

**PriceDetails:** bulkQuantities থাকলে `productPrice = bulkTier.price × quantity` (+ flash sale)। না থাকলে `sum(variant.price × variant.quantity)`।

---

## useProductStore (Zustand)

**State:**
- `selectedColor` – বর্তমান সিলেক্টেড color
- `variants` – `{ color_id, size, quantity, price }[]`
- `shippingArea` – সিলেক্টেড shipping
- `shippingOptions` – available shipping list

**Methods:**
- `setVariant(colorId, size, quantity, price)` – variant add/update
- `totalQuantity()` – সব variant এর quantity এর যোগফল
- `priceList()` – `{ id, price, quantity }[]` (PriceDetails এর জন্য)
- `colorQty(colorId)` – একটি color এর total quantity

---

## ডায়াগ্রাম – Price Calculation Flow

```
                    ┌─────────────────────┐
                    │   bulkQuantities?   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │ YES                             │ NO
              ▼                                 ▼
    ┌─────────────────────┐           ┌─────────────────────┐
    │ getActiveBulkTier() │           │  variant.SalePrice   │
    │ → tier.price        │           │  (size থেকে)         │
    └──────────┬──────────┘           └──────────┬────────────┘
              │                                 │
              └────────────────┬────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ flashSalePercentage?│
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │ YES                             │ NO
              ▼                                 ▼
    basePrice × (1 - pct/100)            basePrice
    (দশমিক রাখা, round নাই)
```
