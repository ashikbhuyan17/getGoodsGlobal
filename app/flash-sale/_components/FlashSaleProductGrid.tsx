import ProductCard from "@/components/common/ProductCard";

function getProductImage(product: {
  image?: { image?: string };
  PostImage?: string;
}): string {
  if (product?.image?.image) return product.image.image;
  try {
    const arr = JSON.parse((product?.PostImage as string) ?? "[]");
    const first = arr?.[0];
    return first ? `public/images/product/slider/${first}` : "/placeholder-product.png";
  } catch {
    return "/placeholder-product.png";
  }
}

function getDiscountPercent(newPrice: number, oldPrice: number): number {
  if (oldPrice <= 0 || newPrice >= oldPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

export type ProductItem = {
  id: number;
  name: string;
  slug: string;
  new_price: string | number;
  old_price?: string | number;
  image?: { image?: string };
  PostImage?: string;
};

export default function FlashSaleProductGrid({
  products,
}: {
  products: ProductItem[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => {
        const newPrice = Number(product.new_price ?? 0);
        const oldPrice = Number(product.old_price ?? 0);
        const discount = getDiscountPercent(newPrice, oldPrice);
        return (
          <ProductCard
            key={product.id}
            slug={product.slug}
            image={getProductImage(product)}
            title={product.name}
            newPrice={newPrice}
            oldPrice={oldPrice > 0 ? oldPrice : undefined}
            discountPercent={discount}
          />
        );
      })}
    </div>
  );
}
