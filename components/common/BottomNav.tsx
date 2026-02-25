/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import {
  Home,
  ShoppingBag,
  Grid2x2,
  MessageSquare,
  Headphones,
} from 'lucide-react';
import { fetcher } from '@/lib/fetcher';
import MobileCategorySheet from './MobileCategorySheet';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Footer = ({ settings, contact }: { settings: any; contact: any }) => (
  <div className="px-3 border-t border-border mt-4">
    <div className="grid grid-cols-1 items-starts gap-1">
      <Link
        href={settings?.data?.messenger}
        target="_blank"
        className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"
          />
        </svg>
        <span className="text-xs font-medium">Messenger</span>
      </Link>

      <Link
        href={`https://wa.me/+88${contact?.data?.phone}`}
        target="_blank"
        className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-medium">Chat</span>
      </Link>

      <Link
        href="/account/support"
        className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <Headphones className="w-5 h-5" />
        <span className="text-xs font-medium">Support</span>
      </Link>
    </div>
  </div>
);

export default async function BottomNav({
  menuCategories,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuCategories?: any;
}) {
  const settings: any = await fetcher(`/settings`);
  const contact: any = await fetcher(`/contact`);

  let cartProducts: any = null;
  try {
    cartProducts = await fetcher('/cart-products');
  } catch {
    // Handle error gracefully
  }
  const cartCount = cartProducts?.data?.length ?? 0;

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white border-t shadow-md
        md:hidden
      "
    >
      <ul className="flex justify-between items-center px-4 py-2 text-xs">
        {/* Home */}
        <li className="flex flex-col items-center">
          <Link href="/" prefetch className="flex flex-col items-center">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
        </li>

        {/* Category - same category+subcategory as desktop */}
        <li className="flex flex-col items-center">
          <MobileCategorySheet
            menuCategories={menuCategories}
            settings={settings}
            contact={contact}
          />
        </li>

        {/* Cart */}
        <li className="flex flex-col items-center">
          <Link href="/cart" className="relative flex flex-col items-center">
            <span className="relative inline-block">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span>Cart</span>
          </Link>
        </li>

        {/* Account */}
        <li className="flex flex-col items-center">
          <Link href="/account" className="flex flex-col items-center">
            <div className="h-7 w-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-[12px] font-medium">
              A
            </div>
            <span>Account</span>
          </Link>
        </li>

        {/* More Drawer */}
        <li className="flex flex-col items-center">
          <Sheet>
            <SheetTrigger className="flex flex-col items-center" aria-label="Open more menu">
              <Grid2x2 className="h-5 w-5" />
              <span className="text-xs">More</span>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="p-0 h-48 rounded-t-2xl overflow-y-auto"
            >
              <Footer settings={settings} contact={contact} />
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
}
