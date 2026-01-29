"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
      <DialogContent className="">
        <DialogHeader>
          <div className="mb-2">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Aboard!
            </h1>
            <p className="text-muted-foreground text-base">
              Your trusted B2B marketplace for wholesale trading
            </p>
          </div>
        </DialogHeader>
        <Card className="p-6 shadow-elevated border-0 bg-card rounded-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm method="modal" />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm method="modal" />
            </TabsContent>
          </Tabs>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default ModalAuthPage;
