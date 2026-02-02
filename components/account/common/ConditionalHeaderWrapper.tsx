"use client";

import { usePathname } from "next/navigation";

export default function ConditionalHeaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Don't show header on order details page
  const isOrderDetailsPage = pathname?.includes("/account/orders/") && 
                             pathname !== "/account/orders" &&
                             !pathname?.includes("/account/orders?");
  
  if (isOrderDetailsPage) {
    return null;
  }
  
  return <>{children}</>;
}
