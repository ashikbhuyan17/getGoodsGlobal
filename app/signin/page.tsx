import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";
import { fetcher } from "@/lib/fetcher";

export default async function AuthPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings: any = await fetcher("/settings");

  return (
    <main className="min-h-screen bg-background flex px-2">
      {/* Left Section - Auth Forms */}
      <section className="flex-1 flex flex-col justify-center px-6 py-12 ">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Text */}
          {/* <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome to {settings?.data?.name}
            </h1>
            <p className="text-muted-foreground text-base">
              Your trusted B2B marketplace for wholesale trading
            </p>
          </div> */}

          {/* Auth Card */}
          <Card className="p-4 shadow-elevated border-0 bg-card rounded-2xl">
            <div className="flex justify-center items-center">
              <Image
                width={120}
                height={120}
                src={`${process.env.NEXT_PUBLIC_IMG_URL}/${settings?.data?.white_logo}`}
                alt="Global wholesale trading network"
              // className="w-full  drop-shadow-xl"
              />
            </div>
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
        </div>
      </section>

      {/* Right Section - Illustration */}
      {/* <section className="hidden lg:flex flex-1 bg-accent items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10" />
        <div className="relative z-10 text-center max-w-lg">
          <Image
            width={1200}
            height={1200}
            src={`${process.env.NEXT_PUBLIC_IMG_URL}/${settings?.data?.white_logo}`}
            alt="Global wholesale trading network"
            className="w-full max-w-md mx-auto mb-8 drop-shadow-xl"
          />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Connect with Global Suppliers
          </h2>
          <p className="text-muted-foreground">
            Join thousands of businesses trading on Bangladesh&apos;s largest
            B2B wholesale marketplace. Source products directly from verified
            manufacturers and suppliers.
          </p>
        </div>
      </section> */}
    </main>
  );
}
