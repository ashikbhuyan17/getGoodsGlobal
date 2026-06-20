'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/isAuthenticatedProfile';

type NavCounts = {
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
};

const EMPTY_COUNTS: NavCounts = {
  cartCount: 0,
  wishlistCount: 0,
  isLoggedIn: false,
};

export function useNavCounts() {
  const pathname = usePathname();
  const [counts, setCounts] = useState<NavCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const safeFetch = async (slug: string) => {
        try {
          return await fetcher(slug);
        } catch {
          return null;
        }
      };

      const [cartProducts, wishlist, userProfile] = await Promise.all([
        safeFetch('/cart-products'),
        safeFetch('/wishlists'),
        safeFetch('/user-profile'),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cart = cartProducts as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wish = wishlist as any;

      setCounts({
        cartCount: cart?.data?.length ?? 0,
        wishlistCount:
          wish?.status === 'error' || !wish?.data ? 0 : wish.data.length,
        isLoggedIn: isAuthenticatedProfile(userProfile),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  return { ...counts, loading, refresh };
}
