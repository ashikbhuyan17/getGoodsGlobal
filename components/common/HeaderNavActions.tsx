'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavCounts } from '@/hooks/useNavCounts';
import SigninBtn from './SigninBtn';

export default function HeaderNavActions() {
  const { cartCount, wishlistCount } = useNavCounts();

  return (
    <div className="hidden md:flex items-center justify-end gap-1 md:gap-3 md:w-2/6 md:pr-10">
      <Link
        prefetch
        href="/cart"
        aria-label={
          cartCount > 0 ? `View cart (${cartCount} items)` : 'View cart'
        }
        className="relative flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100"
      >
        <ShoppingBag className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
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
        className="relative flex md:h-10 w-10 items-center justify-center rounded-full bg-white text-primary hover:bg-gray-100"
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
