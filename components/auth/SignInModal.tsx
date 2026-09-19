'use client';

import { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

function AuthFormsFallback() {
  return <div className="h-48 animate-pulse rounded-lg bg-muted" />;
}

export default function SignInModal() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) router.back();
      }}
      defaultOpen
      open={pathname === '/signin'}
    >
      <DialogContent className="border-0 bg-card rounded-2xl">
        <DialogTitle className="sr-only">Sign in or create account</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to your account or create a new account
        </DialogDescription>
        <Card className="p-6 shadow-none border-0 bg-card">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-2 grid w-full grid-cols-2 gap-4 bg-transparent p-0">
              <TabsTrigger
                value="login"
                className="rounded-lg border border-gray-200 bg-white data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:border-teal-600 transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg border border-gray-200 bg-white data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:border-teal-600 transition-all"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Suspense fallback={<AuthFormsFallback />}>
                <LoginForm method="modal" />
              </Suspense>
            </TabsContent>

            <TabsContent value="register">
              <Suspense fallback={<AuthFormsFallback />}>
                <RegisterForm method="modal" />
              </Suspense>
            </TabsContent>
          </Tabs>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
