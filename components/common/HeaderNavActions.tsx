'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavCounts } from '@/hooks/useNavCounts';
import SigninBtn from './SigninBtn';
import { cn } from '@/lib/utils';

export default function HeaderNavActions() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { cartCount, wishlistCount } = useNavCounts();

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-1.5 sm:gap-3 md:w-2/6 md:pr-10',
        isHome && 'max-sm:hidden',
      )}
    >
      <Link
        prefetch
        href="/cart"
        aria-label={
          cartCount > 0 ? `View cart (${cartCount} items)` : 'View cart'
        }
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 sm:h-10 sm:w-10"
      >
        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-semibold text-white sm:h-5 sm:w-5 sm:text-xs">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </Link>
      <Link
        prefetch
        href="/wishlist"
        aria-label={
          wishlistCount > 0
            ? `View wishlist (${wishlistCount} items)`
            : 'View wishlist'
        }
        className="relative hidden h-8 w-8 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100 sm:flex sm:h-10 sm:w-10"
      >
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </Link>
      <SigninBtn />
    </div>
  );
}
