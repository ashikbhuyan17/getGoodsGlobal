"use client";

import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/lib/fetcher";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

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
      <div className="flex items-start gap-4 pb-4 border-b">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              <Image
                src={image}
                width={96}
                height={96}
                alt={title}
                className="w-24 h-24 rounded object-cover"
              />

              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">
                  Order ID: #{orderId}
                </p>

                <p className="text-sm text-gray-600">{title}</p>
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

      {/* Content */}
      {children}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4">
        <Badge className="bg-blue-100 text-blue-700">{totalItems} Items</Badge>

        <span className="text-lg text-primary font-semibold px-4 py-2 bg-primary/10 rounded-full">
          ৳{totalPrice}
        </span>
      </div>
    </div>
  );
}
