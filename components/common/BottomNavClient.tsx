'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Grid2x2,
  Headphones,
  Heart,
  Home,
  MessageSquare,
  Settings,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useNavCounts } from '@/hooks/useNavCounts';
import BottomNavAuthTile from './BottomNavAuthTile';
import MobileCategorySheet from './MobileCategorySheet';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

function MoreSheetContent({
  settings,
  contact,
  isLoggedIn,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: any;
  isLoggedIn: boolean;
}) {
  return (
    <div className="px-2 pb-6 pt-2">
      <div
        className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-muted"
        aria-hidden
      />
      <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Quick links
      </p>
      <div className="grid grid-cols-3 gap-2">
        <SheetClose asChild>
          <Link
            href="/account"
            prefetch
            className="flex flex-col items-center gap-1 rounded-xl bg-gray-100 p-2.5 text-center transition hover:bg-gray-200"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-primary">
              <User className="h-5 w-5" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-[11px] font-medium leading-tight">Account</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/account/settings"
            prefetch
            className="flex flex-col items-center gap-1 rounded-xl bg-gray-100 p-2.5 text-center transition hover:bg-gray-200"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-primary">
              <Settings className="h-5 w-5" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-[11px] font-medium leading-tight">Settings</span>
          </Link>
        </SheetClose>
        <BottomNavAuthTile isLoggedIn={isLoggedIn} />
      </div>
      <p className="mt-4 px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Support
      </p>
      <div className="grid grid-cols-3 gap-2">
        <SheetClose asChild>
          <Link
            href={settings?.data?.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 transition hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"
              />
            </svg>
            <span className="text-xs font-medium">Messenger</span>
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Link
            href={`https://wa.me/+88${contact?.data?.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 transition hover:bg-gray-200"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Chat</span>
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Link
            href="/account/support"
            prefetch
            className="flex items-center gap-2 rounded-lg bg-gray-100 p-3 transition hover:bg-gray-200"
          >
            <Headphones className="w-5 h-5" />
            <span className="text-xs font-medium">Support</span>
          </Link>
        </SheetClose>
      </div>
    </div>
  );
}

export default function BottomNavClient({
  menuCategories,
  settings,
  contact,
}: {
  menuCategories?: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: any;
}) {
  const pathname = usePathname();
  const { cartCount, wishlistCount, isLoggedIn } = useNavCounts();

  if (
    pathname?.startsWith('/product/') ||
    pathname === '/cart' ||
    pathname === '/checkout'
  )
    return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-md md:hidden">
      <ul className="flex items-center justify-between px-4 py-2 text-xs">
        <li className="flex flex-col items-center">
          <Link href="/" prefetch className="flex flex-col items-center">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
        </li>

        <li className="flex flex-col items-center">
          <MobileCategorySheet
            menuCategories={menuCategories}
            settings={settings}
            contact={contact}
          />
        </li>

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

        <li className="flex flex-col items-center">
          <Link href="/wishlist" className="relative flex flex-col items-center">
            <span className="relative inline-block">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold text-white tabular-nums">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </span>
            <span>Wishlist</span>
          </Link>
        </li>

        <li className="flex flex-col items-center">
          <Link href="/account" className="flex flex-col items-center gap-0.5">
            <User className="h-5 w-5" />
            <span>Account</span>
          </Link>
        </li>

        <li className="flex flex-col items-center">
          <Sheet>
            <SheetTrigger
              className="flex flex-col items-center"
              aria-label="Open more menu"
            >
              <Grid2x2 className="h-5 w-5" />
              <span className="text-xs">More</span>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[min(85vh,520px)] overflow-y-auto rounded-t-2xl p-0"
            >
              <MoreSheetContent
                settings={settings}
                contact={contact}
                isLoggedIn={isLoggedIn}
              />
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
}
