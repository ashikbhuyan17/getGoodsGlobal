/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { StarRating } from "./StarRating";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: number;
  email: string;
  name: string;
}

export function AddReview({ productId, email, name }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name,
    email,
    message: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message || !form.rating) return;

    setLoading(true);

    const res: any = await fetcher("/add-product-review", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        name: form.name,
        email: form.email,
        ratting: form.rating,
        review: form.message,
      }),
    });
    if (res.status == "success") {
      setOpen(false);
      router.refresh();
      setForm({ ...form, message: "", rating: 0 });
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-lg">
        Add Review
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Add Your Review</DialogTitle>
            <DialogDescription>
              Share your experience with this product
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <StarRating
                rating={form.rating}
                interactive
                onRate={(r) => setForm({ ...form, rating: r })}
              />
            </div>

            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Textarea
              placeholder="Review"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="h-20 resize-none"
            />

            <Button
              type="submit"
              disabled={
                loading ||
                !form.name ||
                !form.email ||
                !form.message ||
                !form.rating
              }
              className="w-full"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
