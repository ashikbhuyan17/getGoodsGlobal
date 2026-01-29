"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone is required")
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(01[3-9]\d{8}|8801[3-9]\d{8}|[0-9]{10,15})$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, "Enter a valid email or phone number"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsSubmitting(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher("/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        login: data.email,
      }),
    });

    if (res?.status === true) {
      toast.success("OTP sent. Check your email or phone.");
      router.push("/reset-password");
    } else {
      toast.error(res?.message || "Something went wrong");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto py-14 px-2">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Forgot Password
      </h1>

      <p className="text-center text-sm text-muted-foreground mb-8">
        Enter your email or phone number to receive a reset link or OTP.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email / Phone Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Email or Phone
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="you@example.com or 017XXXXXXXX"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
