"use client";

import { usePathname } from "next/navigation";

export default function ConditionalHeaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Don't show header on order details page or support ticket details page
  const isOrderDetailsPage = pathname?.includes("/account/orders/") && 
                             pathname !== "/account/orders" &&
                             !pathname?.includes("/account/orders?");
  
  const isTicketDetailsPage = pathname?.includes("/account/support/replay/");
  
  if (isOrderDetailsPage || isTicketDetailsPage) {
    return null;
  }
  
  return <>{children}</>;
}
