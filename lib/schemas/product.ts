import { z } from 'zod';

const colorSchema = z.object({
  id: z.number(),
  colorName: z.string(),
  color: z.string(),
  status: z.union([z.string(), z.number()]).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const sizeSchema = z.object({
  id: z.number(),
  product_id: z.union([z.string(), z.number()]),
  size_id: z.union([z.string(), z.number()]),
  color_id: z.union([z.string(), z.number()]),
  size: z.object({
    id: z.number(),
    sizeName: z.string(),
    status: z.union([z.string(), z.number()]).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }),
  stock: z.union([z.string(), z.number()]),
  PurchasePrice: z.union([z.string(), z.number()]).optional(),
  SalePrice: z.union([z.string(), z.number()]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const productColorSchema = z.object({
  id: z.number(),
  product_id: z.union([z.string(), z.number()]),
  color_id: z.union([z.string(), z.number()]),
  color: colorSchema,
  specification: z.unknown().nullable().optional(),
  Image: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  sizes: z.array(sizeSchema),
  color_qty: z.number().optional(),
});

const productImageSchema = z.object({
  id: z.number(),
  image: z.string(),
  product_id: z.union([z.string(), z.number()]),
});

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

const subcategorySchema = z.object({
  id: z.number(),
  subcategoryName: z.string(),
  slug: z.string(),
});

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  short_des: z.string().nullable().optional(),
  slug: z.string(),
  category_id: z.union([z.string(), z.number()]),
  subcategory_id: z.union([z.string(), z.number()]),
  childcategory_id: z.union([z.string(), z.number()]).optional(),
  brand_id: z.union([z.string(), z.number()]).optional(),
  product_code: z.string().optional(),
  purchase_price: z.union([z.string(), z.number()]).optional(),
  banner_img: z.string().nullable().optional(),
  new_price: z.union([z.string(), z.number()]),
  old_price: z.union([z.string(), z.number()]).nullable().optional(),
  prebooking: z.unknown().nullable().optional(),
  stock: z.union([z.string(), z.number()]).nullable().optional(),
  order_by: z.union([z.string(), z.number()]).optional(),
  pro_unit: z.unknown().nullable().optional(),
  pro_video: z.unknown().nullable().optional(),
  PostImage: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  product_weight: z.unknown().nullable().optional(),
  description: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  topsale: z.union([z.string(), z.number()]).optional(),
  feature_product: z.union([z.string(), z.number()]).optional(),
  deal_of_theday: z.union([z.string(), z.number()]).optional(),
  campaign_id: z.unknown().nullable().optional(),
  status: z.union([z.string(), z.number()]),
  type: z.union([z.string(), z.number()]).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  image: productImageSchema.nullable().optional(),
  category: categorySchema.nullable().optional(),
  subcategory: subcategorySchema.nullable().optional(),
  childcategory: z.unknown().nullable().optional(),
});

export const shippingChargeSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.union([z.string(), z.number()]),
  to_amount: z.union([z.string(), z.number()]).optional(),
  status: z.union([z.string(), z.number()]).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const flashSaleSchema = z
  .object({
    id: z.number().optional(),
    flash_sale_title: z.string().optional(),
    flash_sale_percentage: z.string().optional(),
    flash_sale_start_date: z.string().optional(),
    flash_sale_end_date: z.string().optional(),
  })
  .nullable()
  .optional();

export const productApiResponseSchema = z.object({
  product: productSchema,
  shippingCharge: z.array(shippingChargeSchema),
  productColors: z.array(productColorSchema),
  flashSale: flashSaleSchema,
});

export type ProductApiResponse = z.infer<typeof productApiResponseSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductColor = z.infer<typeof productColorSchema>;
export type ShippingCharge = z.infer<typeof shippingChargeSchema>;
