'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  RESET_LOGIN_KEY,
  RESEND_COOLDOWN_SEC,
  clearResetPasswordStorage,
  formatOtpCooldown,
  getOtpCooldownRemaining,
  startOtpCooldown,
} from '@/lib/resetPasswordStorage';

const loginSchema = z
  .string()
  .min(1, 'Email or phone is required')
  .refine((val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(01[3-9]\d{8}|8801[3-9]\d{8}|[0-9]{10,15})$/;
    return emailRegex.test(val) || phoneRegex.test(val);
  }, 'Enter a valid email or phone number');

const resetSchema = z
  .object({
    otp: z.string().min(4, 'OTP is required').max(6, 'OTP must be 4-6 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isCheckingOtp, setIsCheckingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    const fromUrl = searchParams.get('login');
    const storedLogin = sessionStorage.getItem(RESET_LOGIN_KEY) || '';
    const resolvedLogin = fromUrl
      ? decodeURIComponent(fromUrl)
      : storedLogin;

    if (resolvedLogin) {
      setLogin(resolvedLogin);
      setLoginInput(resolvedLogin);
      sessionStorage.setItem(RESET_LOGIN_KEY, resolvedLogin);
    }

    if (fromUrl) {
      startOtpCooldown();
      setResendCooldown(RESEND_COOLDOWN_SEC);
      router.replace('/reset-password', { scroll: false });
    } else {
      setResendCooldown(getOtpCooldownRemaining());
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown(getOtpCooldownRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const sendOtp = async (targetLogin: string) => {
    const parsed = loginSchema.safeParse(targetLogin);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Enter a valid email or phone');
      return false;
    }

    setIsSendingOtp(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ login: parsed.data }),
    });

    if (res?.status === true) {
      sessionStorage.setItem(RESET_LOGIN_KEY, parsed.data);
      setLogin(parsed.data);
      setLoginInput(parsed.data);
      form.setValue('otp', '');
      setIsOtpVerified(false);
      setCustomerId(null);
      setResendCooldown(startOtpCooldown());
      toast.success('OTP sent. Check your email or phone.');
      setIsSendingOtp(false);
      return true;
    }

    toast.error(res?.message || 'Failed to send OTP');
    setIsSendingOtp(false);
    return false;
  };

  const handleRequestOtp = async () => {
    if (isOtpVerified || isSendingOtp || resendCooldown > 0) return;
    await sendOtp(loginInput.trim());
  };

  const handleResendOtp = async () => {
    if (isOtpVerified || isSendingOtp || resendCooldown > 0) return;

    const targetLogin = login || loginInput.trim();
    if (!targetLogin) {
      toast.error('Enter your email or phone number first.');
      return;
    }

    await sendOtp(targetLogin);
  };

  const checkOtp = async () => {
    const otp = form.getValues('otp');

    if (!otp || otp.length < 4) {
      toast.error('Enter a valid OTP');
      return;
    }

    setIsCheckingOtp(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });

    if (res?.status === true) {
      toast.success('OTP verified! You can now reset your password.');
      setIsOtpVerified(true);
      setCustomerId(res?.customer_id);
    } else {
      toast.error(res?.message || 'Invalid OTP');
    }

    setIsCheckingOtp(false);
  };

  const onSubmit = async (data: ResetFormValues) => {
    if (!isOtpVerified) {
      toast.error('Verify OTP first');
      return;
    }

    setIsSubmitting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await fetcher('/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }),
    });
    if (res?.status === true) {
      clearResetPasswordStorage();
      toast.success('Password reset successfully!');
      router.push('/signin');
    } else {
      toast.error(res?.message || 'Failed to reset password');
    }

    setIsSubmitting(false);
  };

  const canSendOtp = !isOtpVerified && !isSendingOtp && resendCooldown <= 0;
  const otpActionLabel = login ? 'Resend OTP' : 'Request OTP';
  const otpActionHandler = login ? handleResendOtp : handleRequestOtp;

  const renderOtpActionSection = () => {
    if (isOtpVerified) return null;

    if (resendCooldown > 0) {
      return (
        <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5">
          <p className="text-sm text-muted-foreground">
            {login
              ? 'OTP already sent. You can resend after'
              : 'Please wait before requesting OTP again.'}
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-primary">
            {formatOtpCooldown(resendCooldown)}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {login
            ? "Didn't receive the OTP on your email or phone?"
            : 'Need an OTP? Enter your email or phone above, then tap the button below.'}
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={otpActionHandler}
          disabled={!canSendOtp || (!login && !loginInput.trim())}
        >
          {isSendingOtp ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            otpActionLabel
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto py-14 px-2">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Reset Password
      </h1>

      <p className="mb-8 text-center text-sm text-muted-foreground">
        Verify OTP first, then set your new password.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Step 1 · Account
              </p>
              <label
                htmlFor="reset-login"
                className="mt-1 block text-sm font-medium"
              >
                Email or Phone
              </label>
            </div>

            {!login ? (
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="reset-login"
                  placeholder="you@example.com or 017XXXXXXXX"
                  className="bg-white pl-10"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  disabled={isSendingOtp || resendCooldown > 0}
                />
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800">
                <span className="text-muted-foreground">OTP sent to </span>
                <span className="font-medium">{login}</span>
              </div>
            )}

            {renderOtpActionSection()}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step 2 · Verify OTP
            </p>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Enter OTP Code
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input
                        placeholder="4–6 digit code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        {...field}
                        disabled={isOtpVerified || !login}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={checkOtp}
                      disabled={isOtpVerified || isCheckingOtp || !login}
                    >
                      {isCheckingOtp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>
                  {!login && (
                    <p className="text-xs text-muted-foreground">
                      Request OTP first using your email or phone above.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step 3 · New Password
            </p>
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
                      type={showPassword ? 'text' : 'password'}
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
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      type={showConfirmPassword ? 'text' : 'password'}
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
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          </div>

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
              'Reset Password'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
