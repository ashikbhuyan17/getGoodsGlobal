import React from "react";
import Header from "@/components/account/common/Header";
import ConditionalHeaderWrapper from "@/components/account/common/ConditionalHeaderWrapper";

function AccountLayout({ children }: { children: React.ReactNode }) {
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
