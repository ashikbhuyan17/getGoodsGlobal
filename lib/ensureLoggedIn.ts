'use client';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { hasAuthCookie } from '@/action/token';
import { fetcher } from '@/lib/fetcher';
import { isAuthenticatedProfile } from '@/lib/isAuthenticatedProfile';
import { openSignInModal } from '@/lib/openSignIn';
import { useNavCountsStore } from '@/hooks/useNavCounts';

export async function ensureLoggedIn(
  router: AppRouterInstance,
  redirectPath: string,
): Promise<boolean> {
  const { isLoggedIn } = useNavCountsStore.getState();
  if (isLoggedIn) return true;

  if (!(await hasAuthCookie())) {
    openSignInModal(router, redirectPath);
    return false;
  }

  try {
    const profile = await fetcher('/user-profile');
    if (isAuthenticatedProfile(profile)) {
      void useNavCountsStore.getState().refresh();
      return true;
    }
  } catch {
    // fall through to sign-in
  }

  openSignInModal(router, redirectPath);
  return false;
}
