import Header from "@/components/account/common/Header";
import React from "react";

function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2">
      <Header />
      {children}
    </div>
  );
}

export default AccountLayout;
