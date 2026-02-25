"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
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

const resetSchema = z
  .object({
    otp: z.string().min(4, "OTP is required").max(6, "OTP must be 4-6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordClient() {
  const router = useRouter();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isCheckingOtp, setIsCheckingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: "",
      password: "",
      password_confirmation: "",
    },
  });

  const checkOtp = async () => {
    const otp = form.getValues("otp");

    if (!otp || otp.length < 4) {
      toast.error("Enter a valid OTP");
      return;
    }

    setIsCheckingOtp(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher("/verify-otp", {
      method: "POST",
      body: JSON.stringify({ otp }),
    });

    if (res?.status === true) {
      toast.success("OTP verified! You can now reset your password.");
      setIsOtpVerified(true);
      setCustomerId(res?.customer_id);
    } else {
      toast.error(res?.message || "Invalid OTP");
    }

    setIsCheckingOtp(false);
  };

  const onSubmit = async (data: ResetFormValues) => {
    if (!isOtpVerified) {
      toast.error("Verify OTP first");
      return;
    }

    setIsSubmitting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher("/reset-password", {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }),
    });
    if (res?.status === true) {
      toast.success("Password reset successfully!");
      router.push("/signin");
    } else {
      toast.error(res?.message || "Failed to reset password");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto py-14 px-2">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Reset Password
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* OTP Field */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">OTP</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input
                      placeholder="Enter OTP"
                      {...field}
                      disabled={isOtpVerified}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={checkOtp}
                    disabled={isOtpVerified || isCheckingOtp}
                  >
                    {isCheckingOtp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Check OTP"
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-10 pr-10"
                      {...field}
                      disabled={!isOtpVerified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      tabIndex={-1}
                      disabled={!isOtpVerified}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10"
                      {...field}
                      disabled={!isOtpVerified}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      tabIndex={-1}
                      disabled={!isOtpVerified}
                    >
                      {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
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
            disabled={isSubmitting || !isOtpVerified}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
