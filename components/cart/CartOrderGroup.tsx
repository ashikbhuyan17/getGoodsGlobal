"use client";

import { fetcher } from "@/lib/fetcher";
import { Check, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface CartOrderGroupProps {
  orderId: string;
  image: string;
  title: string;
  slug?: string;
  page?: "cart" | "checkout";
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  isSelected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onRemoveLoading?: (loading: boolean) => void;
}

export default function CartOrderGroup({
  orderId,
  image,
  title,
  slug,
  children,
  product,
  page = "cart",
  isSelected = true,
  onSelectChange,
  onRemoveLoading,
}: CartOrderGroupProps) {
  const totalItems = product?.cartdetails?.reduce(
    (total: number, prev: { quantity: number }) =>
      Number(total) + Number(prev?.quantity),
    0
  );

  const router = useRouter();

  const totalPrice = product?.cartdetails?.reduce(
    (total: number, prev: { quantity: number; price: number }) =>
      Number(total) + Number(prev?.quantity) * Number(prev?.price),
    0
  );

  const handleDelete = async () => {
    onRemoveLoading?.(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await fetcher(`/cart-remove/${product?.id}`, {
        method: "POST",
      });
      if (res?.status === true) {
        router.refresh();
        toast.success(res?.message || "Product removed from cart");
      } else {
        toast.error(res?.message || "Failed to remove product from cart!");
      }
    } finally {
      onRemoveLoading?.(false);
    }
  };
  const productHref = slug ? `/product/${slug}` : undefined;

  const handleSelectClick = () => {
    if (onSelectChange) {
      onSelectChange(!isSelected);
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg p-3 space-y-3 transition-colors sm:p-4 lg:p-6 lg:space-y-4",
        isSelected || page !== "cart"
          ? "bg-white"
          : "bg-gray-100 opacity-60"
      )}
    >
      {/* Header: mobile wraps title below image+delete; lg keeps a single row */}
      <div className="flex flex-wrap items-start gap-2 lg:flex-nowrap lg:items-center lg:gap-4">
        {page === "cart" && (
          <button
            onClick={handleSelectClick}
            className={cn(
              "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer lg:mt-0 lg:w-6 lg:h-6",
              isSelected
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-200 border-2 border-gray-300 hover:bg-gray-300"
            )}
            aria-label={isSelected ? "Deselect item" : "Select item"}
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-white lg:w-4 lg:h-4" />}
          </button>
        )}

        <div className="relative size-14 shrink-0 sm:size-16">
          <Dialog>
            <DialogTrigger asChild>
              <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center gap-1 bg-black/40 text-sm text-white opacity-0 transition-all duration-300 hover:opacity-100">
                <Eye size={15} /> <span>Preview</span>
              </div>
            </DialogTrigger>

            <DialogContent className="aspect-square max-2xl:w-[400px] max-2xl:h-[400px]">
              <DialogTitle className="sr-only">Image preview: {title}</DialogTitle>
              <DialogDescription className="sr-only">Preview of {title}</DialogDescription>
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover rounded-lg"
              />
            </DialogContent>
          </Dialog>
          {productHref ? (
            <Link href={productHref} aria-label={`Open ${title}`}>
              <Image
                src={image}
                alt={title}
                width={64}
                height={64}
                className="h-full w-full rounded object-cover shadow-md"
              />
            </Link>
          ) : (
            <Image
              src={image}
              alt={title}
              width={64}
              height={64}
              className="h-full w-full rounded object-cover shadow-md"
            />
          )}
        </div>

        {page === "cart" && (
          <button
            onClick={handleDelete}
            className="ml-auto shrink-0 p-1 text-red-500 hover:text-red-700 lg:order-last lg:ml-0"
            aria-label="Remove from cart"
          >
            <Trash2 size={18} className="lg:size-5" />
          </button>
        )}

        <div className="min-w-0 w-full basis-full lg:w-auto lg:flex-1 lg:basis-0">
          <p className="text-xs font-medium text-neutral-500 lg:text-sm lg:font-semibold lg:text-foreground">
            Order ID: #{orderId}
          </p>

          {productHref ? (
            <Link
              href={productHref}
              className="mt-0.5 line-clamp-2 text-sm font-semibold hover:text-primary transition-colors"
            >
              {title}
            </Link>
          ) : (
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold">{title}</p>
          )}
        </div>
      </div>
      <div className="border-b"></div>

      {/* Content */}
      {children}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 lg:pt-4">
        <div className="text-xs py-0.5 px-1.5 border border-blue-200 text-[#0958d9] font-medium bg-[#E6F4FF] rounded">
          {totalItems} Items
        </div>

        <div className="text-xs py-0.5 px-1.5 border border-red-200 text-[#d4380d] font-medium bg-[#FFF2E8] rounded">
          <span className="text-[10px]">৳</span>{totalPrice}
        </div>
      </div>
    </div>
  );
}
