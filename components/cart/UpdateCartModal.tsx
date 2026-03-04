"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import QuantityUpdateBtn from "../common/QuantityUpdateBtn";
import { Button } from "../ui/button";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function UpdateCartModal({
  children,
  color,
  size,
  qty,
  id,
  price,
  onRemoveLoading,
}: {
  children: React.ReactNode;
  color?: string;
  size?: string;
  qty: number;
  id: number | string;
  price: number;
  onRemoveLoading?: (loading: boolean) => void;
}) {
  const [quantity, setQuantity] = useState(qty);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    onRemoveLoading?.(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await fetcher(`/cart-details-delete/${id}`, {
        method: "POST",
      });

      if (res?.status === "success") {
        router.refresh();
        setOpen(false);
        toast.success(res?.message || "Item removed from cart");
      } else {
        toast.error(res?.message || "Failed to remove item from cart");
      }
    } finally {
      onRemoveLoading?.(false);
    }
  };

  const handleUpdateCart = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher(`/cart-details-update/${id}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });

    if (res?.status === "success") {
      router.refresh();
      setOpen(false);
      toast.success(res?.message || "Item removed from cart");
    } else {
      toast.error(res?.message || "Failed to remove item from cart");
    }
  };

  return (
    <div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cart Item</DialogTitle>
            <DialogDescription className="sr-only">Update quantity or remove this item from your cart</DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex items-center justify-between">
              <div className="font-medium">
                <h4>
                  Color: <span>{color ?? "N/A"}</span>
                </h4>
                <h4>
                  Size: <span>{size ?? "N/A"}</span>
                </h4>
              </div>
              <div>
                <QuantityUpdateBtn
                  size="M"
                  quantity={quantity}
                  setQuantity={setQuantity}
                  max={20000000}
                  min={1}
                />
              </div>
            </div>
            <div className="mt-4 space-x-2">
              <button className="bg-primary/10 text-primary border border-primary/60 text-sm px-2 rounded-sm font-medium">
                Total Items: {quantity}
              </button>
              <button className="bg-red-500/10 text-red-500 border border-red-500/60 text-sm px-2 rounded-sm font-medium">
                Subtotal: ৳ {quantity * price}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-500"
                >
                  Delete
                </Button>
              </div>

              <div className="space-x-1">
                <DialogClose>
                  <Button className="bg-[#aaaaaa] hover:bg-[#aaaaaa]">
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleUpdateCart}>Update</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdateCartModal;
