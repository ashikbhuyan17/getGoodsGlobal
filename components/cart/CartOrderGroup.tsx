"use client";

import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/lib/fetcher";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";

interface CartOrderGroupProps {
  orderId: string;
  image: string;
  title: string;
  page?: "cart" | "checkout";
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export default function CartOrderGroup({
  orderId,
  image,
  title,
  children,
  product,
  page = "cart",
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
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1 items-center">
              {/* <Image
                src={image}
                width={96}
                height={96}
                alt={title}
                className="w-24 h-24 rounded object-cover"
              /> */}

              <div className="w-16 h-16 flex-shrink-0">
                <div className="relative w-16 h-16">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="absolute inset-0 flex items-center justify-center gap-1 text-sm bg-black/40 text-white cursor-pointer opacity-0 hover:opacity-100 transition-all duration-300 z-10">
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
                  <Image
                    src={image}
                    alt={title}
                    width={64}
                    height={64}
                    className="w-full h-full rounded shadow-md object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">
                  Order ID: #{orderId}
                </p>

                <p className="text-sm font-semibold">{title}</p>
              </div>
            </div>

            {page === "cart" && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="border-b"></div>

      {/* Content */}
      {children}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-xs py-[2px] px-[6px] border border-blue-200 text-[#0958d9] font-medium bg-[#E6F4FF] rounded">
          {totalItems} Items
        </div>

        <div className="text-xs py-[2px] px-[6px] border border-red-200 text-[#d4380d] font-medium bg-[#FFF2E8] rounded">
          <span className="text-[10px]">৳</span>{totalPrice}
        </div>
      </div>
    </div>
  );
}
