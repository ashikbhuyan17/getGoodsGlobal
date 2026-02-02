import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GridIcon, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";
import Logout from "./Logout";
import { fetcher } from "@/lib/fetcher";

async function Header() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = await fetcher("/user-profile");

  return (
    <header className="px-2">
      <div className="bg-white border-b border-gray-200 rounded mb-4">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-gray-300">
                <AvatarFallback>
                  {user?.data?.name?.split(" ")?.[0]?.[0]}
                  {user?.data?.name?.split(" ")?.[1]?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {user?.data?.name}
                </p>
                <p className="font-semibold text-sm text-foreground/60">
                  {user?.data?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-8 overflow-x-auto pb-2">
            {[
              { icon: GridIcon, label: "Dashboard", url: "/account" },
              { icon: ShoppingCart, label: "Orders", url: "/account/orders" },
              { icon: Settings, label: "Settings", url: "/account/settings" },
            ].map((item) => (
              <Link
                prefetch
                href={item?.url}
                key={item.label}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
            <Logout />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
