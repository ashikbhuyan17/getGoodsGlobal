'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { create } from 'zustand';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/isAuthenticatedProfile';

type NavCounts = {
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
};

type NavCountsStore = NavCounts & {
  loading: boolean;
  refresh: () => Promise<void>;
  bumpWishlist: (delta: number) => void;
};

const EMPTY_COUNTS: NavCounts = {
  cartCount: 0,
  wishlistCount: 0,
  isLoggedIn: false,
};

let refreshPromise: Promise<void> | null = null;

export const useNavCountsStore = create<NavCountsStore>((set, get) => ({
  ...EMPTY_COUNTS,
  loading: true,
  bumpWishlist: (delta) =>
    set({ wishlistCount: Math.max(0, get().wishlistCount + delta) }),
  refresh: async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const safeFetch = async (slug: string) => {
          try {
            return await fetcher(slug, { cache: 'no-store' });
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

        set({
          cartCount: cart?.data?.length ?? 0,
          wishlistCount:
            wish?.status === 'error' || !wish?.data ? 0 : wish.data.length,
          isLoggedIn: isAuthenticatedProfile(userProfile),
          loading: false,
        });
      } finally {
        set({ loading: false });
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },
}));

export function useNavCounts() {
  const pathname = usePathname();
  const counts = useNavCountsStore();

  useEffect(() => {
    void useNavCountsStore.getState().refresh();
  }, [pathname]);

  return counts;
}
