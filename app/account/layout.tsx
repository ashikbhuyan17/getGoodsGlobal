import React from "react";
import Header from "@/components/account/common/Header";
import ConditionalHeaderWrapper from "@/components/account/common/ConditionalHeaderWrapper";
import { redirect } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { isAuthenticatedProfile } from "@/lib/isAuthenticatedProfile";

async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Server-side guard: prevent direct access to /account routes when logged out.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = await fetcher("/user-profile", { cache: "no-store" });
  if (!isAuthenticatedProfile(profile)) {
    redirect("/signin?redirect=/account");
  }

  return (
    <>
      <ConditionalHeaderWrapper>
        <Header />
      </ConditionalHeaderWrapper>
      <div >
        {children}
      </div>
    </>
  );
}

export default AccountLayout;
