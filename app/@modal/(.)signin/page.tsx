"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

function ModalAuthPage() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) {
          router.back();
        }
      }}
      defaultOpen
      open={pathname === "/signin"}
    >
      <DialogContent className="border-0 bg-card rounded-2xl">
        <DialogTitle className="sr-only">Sign in or create account</DialogTitle>
        <DialogDescription className="sr-only">Sign in to your account or create a new account</DialogDescription>
        {/* <DialogHeader>
          <div className="mb-2">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Aboard!
            </h1>
            <p className="text-muted-foreground text-base">
              Your trusted B2B marketplace for wholesale trading
            </p>
          </div>
        </DialogHeader> */}
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
              <LoginForm method="page" />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm method="page" />
            </TabsContent>
          </Tabs>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default ModalAuthPage;
